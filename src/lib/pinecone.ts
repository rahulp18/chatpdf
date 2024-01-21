import { Pinecone,PineconeRecord } from "@pinecone-database/pinecone";
import { downloadFromS3 } from "./s3-server";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import fs from 'fs'

import md5 from 'md5'

import {Document,RecursiveCharacterTextSplitter} from '@pinecone-database/doc-splitter'
import { getEmbeddings } from "./embeddings";
import { convertToAscii } from "./utils";
type IndexSignature = {
    [key: string]: any
  }
  
  export interface PineconeRecordMetadata {
    fileKey: string
    pageNumber: number
    text: string
  }
  

export const getPineconeClient=()=>{
    return new Pinecone({
        apiKey:process.env.PINECONE_API_KEY!,
         
    })
}

type PDFPage = {
    pageContent: string;
    metadata: {
      loc: { pageNumber: number };
    };
  };

export async function loadS3IntoPinecone(fileKey:string){
    console.log("downloading s3 into file system");
    const file_name=await downloadFromS3(fileKey)
    console.log("File System",file_name)
    if(!file_name){
        throw new Error('could not download file from s3')

    }
    console.log("Loading pdf into memory"+file_name)
    const loader=new PDFLoader(file_name)
    const pages = (await loader.load()) as PDFPage[];
    fs.unlinkSync(file_name);

 
    // 2. Split and segment the pdf
    const documents=await Promise.all(pages.map(prepareDocument));

    // 3. vectories and embed individual documents

    const vectors=await Promise.all(documents.flat().map(embedDocument))
    const records = vectors.map((vector) => ({
        ...vector,
        metadata: { ...vector.metadata, fileKey },
      })) as PineconeRecord<PineconeRecordMetadata & IndexSignature>[]
    // console.log("Vectors",vectors)
    // 4. upload to pinecone
    const client=await getPineconeClient();

 await client.index("chatpdf").upsert(records);
    // const namespace=pineconeIndex.namespace(convertToAscii(fileKey))

    console.log("inserting vectors into pinecone");
    //   console.log("index",namespace)
    // await namespace.upsert(vectors);
        // to delete temp file after getting data processed
       
    return documents[0]

}

async function embedDocument(doc:Document){
    try {
       const embeddings=await getEmbeddings(doc.pageContent);
       const hash=md5(doc.pageContent) 
  console.log("embedding",embeddings)
       return{
        id:hash,
        values:embeddings,
        metadata:{
            text:doc.metadata.text,
            pageNumber:doc.metadata.pageNumber
        }
       } as PineconeRecord
    } catch (error) {
        console.log("Error embedding document",error)
        throw error
    }
}

export const truncateStringByBytes=(str:string,bytes:number)=>{
    const enc=new TextEncoder();
    return new TextDecoder('utf-8').decode(enc.encode(str).slice(0,bytes));
}

async function prepareDocument(page:PDFPage){
let {pageContent,metadata}=page;

pageContent=pageContent.replace(/\n/g,"");

const splitter=new RecursiveCharacterTextSplitter();
const docs=await splitter.splitDocuments([
    new Document({
        pageContent,
        metadata:{
            pageNumber:metadata.loc.pageNumber,
            text:truncateStringByBytes(pageContent,36000)
        }
    })
]);
return docs;
}
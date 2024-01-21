import { NextResponse } from "next/server";
 import { prismadb } from "@/lib/prismadb";
import { loadS3IntoPinecone } from "@/lib/pinecone";
import { auth } from "@clerk/nextjs";
import { getS3Url } from "@/lib/s3";
export async function POST(req:Request){
    const {userId}=await auth();
    if(!userId){
        return NextResponse.json({error:'Unauthorized'},{status:401})
    }
    try {
        const {file_key,file_name}=await req.json();
     await loadS3IntoPinecone(file_key);
     const chat=await prismadb.chat.create({
        data:{
            fileKey:file_key,
            pdfUrl:getS3Url(file_key),
            pdfName:file_name,
            userId,
        }
     });
      
      return NextResponse.json({chat_id:chat.id},{status:200})
    } catch (error) {
        return NextResponse.json({error:'Internal Server error'},{status:500})
    }
}
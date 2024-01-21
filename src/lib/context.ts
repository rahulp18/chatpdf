import { Pinecone } from '@pinecone-database/pinecone';
import { convertToAscii } from './utils';
import { getEmbeddings } from './embeddings';

export async function getMatchesFromEmbeddings(
  embeddings: number[],
  fileKey: string,
) {
  try {
    const client = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
    // const pineconeIndex = await client.index('chatpdf');
    // const namespace = pineconeIndex.namespace(convertToAscii(fileKey));
    // const queryResult = await namespace.query({
    //   topK: 5,
    //   vector: embeddings,
    //   includeMetadata: true,
    // });
    const { matches } = await client
    .index('chatpdf')
    .query({
      topK: 5,
      includeMetadata: true,
      vector: embeddings,
      filter: { fileKey },
    })
    return  matches || [];
  } catch (error) {
    console.log('Error querying embeddings', error);
    throw error;
  }
}

export async function getContext(query: string, fileKey: string) {
  const queryEmbeddings = await getEmbeddings(query);
  const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey);

  const qualifyingDocs = matches.filter(
    match => match.score && match.score > 0.7,
  );

  type MetaData = {
    text: string;
    pageNumber: number;
  };

  let docs = qualifyingDocs.map(match => (match.metadata as MetaData).text);
  return docs.join('\n').substring(0, 3000);
}

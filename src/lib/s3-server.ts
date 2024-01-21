import { S3 } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream';
export async function downloadFromS3(file_key: string)  {
 try {
    const s3 = new S3({
        region: process.env.NEXT_PUBLIC_S3_REGION!,
        credentials: {
          accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_KEY!,
        },
      });
      const params = {
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
        Key: file_key,
      };
      const obj = await s3.getObject(params);
      if(!obj.Body){
        throw new Error('Empty or invalid response from s3 getObject')
      }

      const localFilePath = path.join(process.cwd(), 'tmp', `elliott${Date.now()}.pdf`);
  
    // Use stream.pipeline to correctly handle the stream
    await new Promise((resolve, reject) => {
        // @ts-ignore
        pipeline(obj.Body, fs.createWriteStream(localFilePath), (err) => {
          if (err) {
            reject(err);
          } else {
            // @ts-ignore
            resolve();
          }
        });
      });
      return localFilePath;
 } catch (error) {
    console.error('Error downloading file from S3:', error);
    throw error
 }
 
}

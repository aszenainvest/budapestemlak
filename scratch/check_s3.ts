import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { config } from 'dotenv';
config();

async function list() {
  const client = new S3Client({
    region: process.env.S3_REGION || 'us-east-1',
    endpoint: process.env.S3_ENDPOINT,
    forcePathStyle: true,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },
  });

  try {
    let isTruncated = true;
    let nextContinuationToken;

    while (isTruncated) {
      const data = await client.send(new ListObjectsV2Command({
        Bucket: process.env.S3_BUCKET,
        ContinuationToken: nextContinuationToken,
      }));

      data.Contents?.forEach(c => console.log(c.Key));

      isTruncated = data.IsTruncated;
      nextContinuationToken = data.NextContinuationToken;
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

list();

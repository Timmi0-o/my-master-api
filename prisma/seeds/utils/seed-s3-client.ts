import {
  CreateBucketCommand,
  DeleteObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
  S3ServiceException,
} from '@aws-sdk/client-s3';
import { loadS3Config } from '../../../src/modules/files/infrastructure/config/s3.config';

export type SeedS3Client = {
  bucket: string;
  ensureBucket: () => Promise<void>;
  putObject: (key: string, body: Buffer, contentType: string) => Promise<void>;
  deleteObject: (key: string) => Promise<void>;
};

export const createSeedS3Client = (): SeedS3Client => {
  const config = loadS3Config();
  const client = new S3Client({
    endpoint: config.endpoint,
    region: config.region,
    credentials: {
      accessKeyId: config.accessKey,
      secretAccessKey: config.secretKey,
    },
    forcePathStyle: config.forcePathStyle,
    requestChecksumCalculation: 'WHEN_REQUIRED',
    responseChecksumValidation: 'WHEN_REQUIRED',
  });

  const ensureBucket = async (): Promise<void> => {
    try {
      await client.send(new HeadBucketCommand({ Bucket: config.bucket }));
      return;
    } catch (error: unknown) {
      const isNotFound =
        (error instanceof S3ServiceException && error.name === 'NotFound') ||
        (error as { $metadata?: { httpStatusCode?: number } }).$metadata
          ?.httpStatusCode === 404;

      if (!isNotFound) {
        throw error;
      }
    }

    await client.send(new CreateBucketCommand({ Bucket: config.bucket }));
  };

  const putObject = async (
    key: string,
    body: Buffer,
    contentType: string,
  ): Promise<void> => {
    await client.send(
      new PutObjectCommand({
        Bucket: config.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
      }),
    );
  };

  const deleteObject = async (key: string): Promise<void> => {
    await client.send(
      new DeleteObjectCommand({
        Bucket: config.bucket,
        Key: key,
      }),
    );
  };

  return {
    bucket: config.bucket,
    ensureBucket,
    putObject,
    deleteObject,
  };
};

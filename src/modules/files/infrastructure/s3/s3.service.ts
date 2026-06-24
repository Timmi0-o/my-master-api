import {
  CreateBucketCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  HeadObjectCommand,
  type HeadObjectOutput,
  PutObjectCommand,
  type PutObjectCommandInput,
  S3Client,
  S3ServiceException,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import type { NodeJsClient } from '@smithy/types';
import { makeChunkedTokenizerFromS3 } from '@tokenizer/s3';
import { loadS3Config } from '../config/s3.config';

@Injectable()
export class S3Service implements OnModuleInit {
  private readonly logger = new Logger(S3Service.name);
  private readonly s3Client: NodeJsClient<S3Client>;
  private readonly s3PublicClient: NodeJsClient<S3Client>;
  private readonly defaultBucket: string;

  constructor() {
    const config = loadS3Config();
    const clientConfig = {
      endpoint: config.endpoint,
      region: config.region,
      credentials: {
        accessKeyId: config.accessKey,
        secretAccessKey: config.secretKey,
      },
      requestChecksumCalculation: 'WHEN_REQUIRED' as const,
      responseChecksumValidation: 'WHEN_REQUIRED' as const,
      forcePathStyle: config.forcePathStyle,
    };

    this.s3Client = new S3Client(clientConfig);
    this.s3PublicClient = new S3Client({
      ...clientConfig,
      endpoint: config.publicEndpoint,
    });
    this.defaultBucket = config.bucket;
  }

  async onModuleInit(): Promise<void> {
    const config = loadS3Config();
    this.logger.log(
      `S3 internal endpoint: ${config.endpoint}, public: ${config.publicEndpoint}, bucket: ${config.bucket}`,
    );
    await this.ensureBucketExists();
  }

  getDefaultBucket(): string {
    return this.defaultBucket;
  }

  async presignedPutObject(
    objectName: string,
    bucketName: string,
    sha256sum?: string,
  ): Promise<string> {
    const putInput: PutObjectCommandInput = {
      Key: objectName,
      Bucket: bucketName,
    };

    const opts: Parameters<typeof getSignedUrl>[2] = {
      expiresIn: 60 * 5,
    };

    if (sha256sum) {
      putInput.ChecksumSHA256 = sha256sum;
      putInput.ChecksumAlgorithm = 'SHA256';
      opts.unhoistableHeaders = new Set([
        'x-amz-sdk-checksum-algorithm',
        'x-amz-checksum-sha256',
      ]);
    } else {
      putInput.ChecksumAlgorithm = 'SHA256';
    }

    return getSignedUrl(
      this.s3PublicClient,
      new PutObjectCommand(putInput),
      opts,
    );
  }

  async deleteFile(key: string, bucket?: string): Promise<void> {
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: bucket ?? this.defaultBucket,
        Key: key,
      }),
    );
  }

  async getFileHead(key: string, bucket: string): Promise<HeadObjectOutput> {
    return this.s3Client.send(
      new HeadObjectCommand({
        Bucket: bucket,
        Key: key,
        ChecksumMode: 'ENABLED',
      }),
    );
  }

  async getObject(objectName: string, bucketName: string, range?: string) {
    return this.s3Client.send(
      new GetObjectCommand({
        Bucket: bucketName,
        Key: objectName,
        Range: range,
      }),
    );
  }

  async getS3Tokenizer(objectName: string, bucketName: string) {
    return makeChunkedTokenizerFromS3(this.s3Client, {
      Bucket: bucketName,
      Key: objectName,
    });
  }

  private async ensureBucketExists(): Promise<void> {
    const maxAttempts = 10;
    const delayMs = 2000;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        await this.s3Client.send(
          new HeadBucketCommand({ Bucket: this.defaultBucket }),
        );
        this.logger.log(`Bucket ${this.defaultBucket} is accessible`);
        return;
      } catch (error: unknown) {
        const err = error as {
          $metadata?: { httpStatusCode?: number };
          name?: string;
          message?: string;
          code?: string;
        };

        if (
          err.$metadata?.httpStatusCode === 404 ||
          (error instanceof S3ServiceException && error.name === 'NotFound')
        ) {
          await this.s3Client.send(
            new CreateBucketCommand({ Bucket: this.defaultBucket }),
          );
          this.logger.log(`Bucket ${this.defaultBucket} created`);
          return;
        }

        const isConnectionError =
          err.code === 'ECONNREFUSED' ||
          err.code === 'ENOTFOUND' ||
          err.name === 'AggregateError';

        if (isConnectionError && attempt < maxAttempts) {
          this.logger.warn(
            `MinIO unavailable (attempt ${attempt}/${maxAttempts}), retrying in ${delayMs}ms...`,
          );
          await this.sleep(delayMs);
          continue;
        }

        this.logger.error(
          `Error checking bucket (attempt ${attempt}/${maxAttempts}): ${err.message ?? 'unknown'}`,
        );
        throw error;
      }
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

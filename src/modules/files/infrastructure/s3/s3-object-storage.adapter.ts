import { Injectable } from '@nestjs/common';
import type {
  IObjectStoragePort,
  IObjectStoragePutObjectInput,
} from '../../application/ports/i-object-storage.port';
import { S3Service } from '../s3/s3.service';

@Injectable()
export class S3ObjectStorageAdapter implements IObjectStoragePort {
  constructor(private readonly s3Service: S3Service) {}

  getDefaultBucket(): string {
    return this.s3Service.getDefaultBucket();
  }

  buildS3FileUrl(objectKey: string, bucket?: string): string {
    return `s3://${bucket ?? this.getDefaultBucket()}/${objectKey}`;
  }

  async getObjectBuffer(objectKey: string, bucket?: string): Promise<Buffer> {
    const response = await this.s3Service.getObject(
      objectKey,
      bucket ?? this.getDefaultBucket(),
    );

    const body = response.Body;
    if (!body) {
      throw new Error(`Empty S3 object body for key: ${objectKey}`);
    }

    const bytes = await body.transformToByteArray();
    return Buffer.from(bytes);
  }

  async putObject(input: IObjectStoragePutObjectInput): Promise<void> {
    const bucket = input.bucket ?? this.getDefaultBucket();

    await this.s3Service.putObject({
      key: input.objectKey,
      bucket,
      body: input.body,
      contentType: input.contentType,
    });
  }

  async deleteObject(objectKey: string, bucket?: string): Promise<void> {
    await this.s3Service.deleteFile(
      objectKey,
      bucket ?? this.getDefaultBucket(),
    );
  }
}

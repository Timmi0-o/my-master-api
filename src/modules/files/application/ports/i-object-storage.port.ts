export type IObjectStoragePutObjectInput = {
  objectKey: string;
  body: Buffer;
  contentType: string;
  bucket?: string;
};

export interface IObjectStoragePort {
  getObjectBuffer(objectKey: string, bucket?: string): Promise<Buffer>;
  putObject(input: IObjectStoragePutObjectInput): Promise<void>;
  deleteObject(objectKey: string, bucket?: string): Promise<void>;
  getDefaultBucket(): string;
  buildS3FileUrl(objectKey: string, bucket?: string): string;
}

export const OBJECT_STORAGE_PORT_TOKEN = Symbol('OBJECT_STORAGE_PORT_TOKEN');

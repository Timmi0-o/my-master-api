export interface IS3Config {
  endpoint: string;
  publicEndpoint: string;
  region: string;
  accessKey: string;
  secretKey: string;
  bucket: string;
  forcePathStyle: boolean;
}

export function loadS3Config(): IS3Config {
  const minioPort = process.env.MINIO_PORT ?? '9010';

  return {
    endpoint:
      process.env.S3_ENDPOINT ??
      (process.env.NODE_ENV === 'production'
        ? 'http://my-master-minio:9000'
        : `http://localhost:${minioPort}`),
    publicEndpoint:
      process.env.S3_PUBLIC_ENDPOINT ?? `http://localhost:${minioPort}`,
    region: process.env.S3_REGION ?? 'us-east-1',
    accessKey: process.env.S3_ACCESS_KEY ?? 'minio',
    secretKey: process.env.S3_SECRET_KEY ?? 'minio123456',
    bucket: process.env.S3_BUCKET ?? 'my-master',
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE !== 'false',
  };
}

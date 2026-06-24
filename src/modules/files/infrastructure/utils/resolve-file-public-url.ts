import { FileAccessLevel } from '../../domain/entities/file';
import { loadS3Config } from '../config/s3.config';

const S3_FILE_URL_PATTERN = /^s3:\/\/([^/]+)\/(.+)$/;

export function resolveFilePublicUrl(
  fileUrl: string,
  accessLevel: FileAccessLevel,
): string {
  if (accessLevel !== FileAccessLevel.PUBLIC) {
    return fileUrl;
  }

  const match = fileUrl.match(S3_FILE_URL_PATTERN);
  if (!match) {
    return fileUrl;
  }

  const [, bucket, key] = match;
  const publicBase = loadS3Config().publicEndpoint.replace(/\/$/, '');

  return `${publicBase}/${bucket}/${key}`;
}

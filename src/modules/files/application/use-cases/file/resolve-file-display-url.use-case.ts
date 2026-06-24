import { FileAccessLevel } from '../../../domain/entities/file';
import { S3Service } from '../../../infrastructure/s3/s3.service';
import { parseS3Url } from '../../../infrastructure/utils/parse-s3-url';
import { resolveFilePublicUrl } from '../../../infrastructure/utils/resolve-file-public-url';

export class ResolveFileDisplayUrlUseCase {
  constructor(private readonly s3Service: S3Service) {}

  async execute(
    fileUrl: string,
    accessLevel: FileAccessLevel = FileAccessLevel.PRIVATE,
  ): Promise<string> {
    if (fileUrl.includes('X-Amz-Signature=')) {
      return fileUrl;
    }

    if (accessLevel === FileAccessLevel.PUBLIC) {
      return resolveFilePublicUrl(fileUrl, accessLevel);
    }

    const parsed = parseS3Url(fileUrl);
    if (!parsed) {
      return fileUrl;
    }

    const bucket = parsed.bucket ?? this.s3Service.getDefaultBucket();

    return this.s3Service.presignedGetObject(parsed.key, bucket);
  }
}

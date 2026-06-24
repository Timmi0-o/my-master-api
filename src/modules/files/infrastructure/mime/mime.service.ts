import { Injectable } from '@nestjs/common';
import { fileTypeFromTokenizer } from 'file-type';
import type { IMimeDetectorPort } from '../../application/ports/i-mime-detector.port';
import type { IFileEntity } from '../../domain/entities/file';
import { parseS3Url } from '../utils/parse-s3-url';
import { S3Service } from '../s3/s3.service';

@Injectable()
export class MimeService implements IMimeDetectorPort {
  constructor(private readonly s3: S3Service) {}

  async detect(file: IFileEntity): Promise<string | undefined> {
    const parsed = parseS3Url(file.fileUrl);
    if (!parsed?.bucket) {
      return undefined;
    }

    const tokenizer = await this.s3.getS3Tokenizer(parsed.key, parsed.bucket);
    const result = await fileTypeFromTokenizer(tokenizer);
    return result?.mime;
  }
}

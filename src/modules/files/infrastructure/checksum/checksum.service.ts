import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import type { IChecksumCalculatorPort } from '../../application/ports/i-checksum-calculator.port';
import type { IFileEntity } from '../../domain/entities/file';
import { parseS3Url } from '../utils/parse-s3-url';
import { S3Service } from '../s3/s3.service';

@Injectable()
export class ChecksumService implements IChecksumCalculatorPort {
  constructor(private readonly s3: S3Service) {}

  async getChecksum(file: IFileEntity): Promise<string | undefined> {
    const parsed = parseS3Url(file.fileUrl);
    if (!parsed?.bucket) {
      return undefined;
    }

    const head = await this.s3.getFileHead(parsed.key, parsed.bucket);
    if (head.ChecksumSHA256) {
      return head.ChecksumSHA256;
    }

    const obj = await this.s3.getObject(parsed.key, parsed.bucket);
    if (!obj.Body) {
      return undefined;
    }

    const hash = createHash('sha256');
    for await (const chunk of obj.Body as AsyncIterable<Buffer>) {
      hash.update(chunk);
    }

    return hash.digest('base64');
  }
}

import { Injectable } from '@nestjs/common';
import crypto from 'crypto';
import type {
  IFileUploaderPort,
  SignedUrlEntry,
} from '../../application/ports/i-file-uploader.port';
import { S3Service } from './s3.service';

@Injectable()
export class S3UploadService implements IFileUploaderPort {
  constructor(private readonly s3Service: S3Service) {}

  async getPresignedUrl(
    file: { name: string; sha256sum?: string },
    options?: { ownerKind?: string; ownerId?: string },
  ): Promise<SignedUrlEntry> {
    const bucket = this.s3Service.getDefaultBucket();

    const slug = this.generateSlugByOrigName(file.name);

    const objectKey = this.generateFileKey(
      crypto.randomUUID(),
      file.name,
      options,
    );
    const url = await this.s3Service.presignedPutObject(
      objectKey,
      bucket,
      file.sha256sum,
    );
    return {
      url,
      fileUrl: `s3://${bucket}/${objectKey}`,
      slug,
    };
  }

  private generateSlugByOrigName(originalName: string): string {
    const baseName = originalName.includes('.')
      ? originalName.slice(0, originalName.lastIndexOf('.'))
      : originalName;
    const transliterated = this.transliterateCyrillic(baseName);
    return (
      transliterated
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 200) || 'file'
    );
  }

  private transliterateCyrillic(text: string): string {
    const map: Record<string, string> = {
      а: 'a',
      б: 'b',
      в: 'v',
      г: 'g',
      д: 'd',
      е: 'e',
      ё: 'e',
      ж: 'zh',
      з: 'z',
      и: 'i',
      й: 'y',
      к: 'k',
      л: 'l',
      м: 'm',
      н: 'n',
      о: 'o',
      п: 'p',
      р: 'r',
      с: 's',
      т: 't',
      у: 'u',
      ф: 'f',
      х: 'h',
      ц: 'ts',
      ч: 'ch',
      ш: 'sh',
      щ: 'sch',
      ъ: '',
      ы: 'y',
      ь: '',
      э: 'e',
      ю: 'yu',
      я: 'ya',
      і: 'i',
      ї: 'yi',
      є: 'e',
      ґ: 'g',
      ў: 'u',
    };
    return text
      .split('')
      .map((char) => map[char.toLowerCase()] ?? char)
      .join('');
  }

  private generateFileKey(
    fileId: string,
    originalName: string,
    options?: { ownerKind?: string; ownerId?: string },
  ): string {
    const extension = originalName.split('.').pop() || '';
    const timestamp = Date.now();

    if (options?.ownerKind && options?.ownerId) {
      return `${options.ownerKind}/${options.ownerId}/${timestamp}-${fileId}.${extension}`;
    }

    return `files/${timestamp}-${fileId}.${extension}`;
  }
}

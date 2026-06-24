import {
  Body,
  Controller,
  Headers,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { FileUploadedUseCase } from '../../../application/use-cases/file/file-uploaded.use-case';

type MinioWebhookPayload = {
  EventName: string;
  Key: string;
  Records: Array<{
    s3: {
      bucket: { name: string };
      object: {
        key: string;
        size: number;
        eTag: string;
        contentType: string;
        userMetadata: Record<string, unknown>;
      };
    };
  }>;
};

@Controller({ path: 'internal/files', version: '1' })
export class FilesInternalController {
  constructor(private readonly fileUploadedUseCase: FileUploadedUseCase) {}

  @Post('minio-events')
  async handleMinioEvent(
    @Body() body: MinioWebhookPayload,
    @Headers('x-minio-webhook-secret') secret?: string,
    @Headers('authorization') authorization?: string,
  ) {
    const expectedSecret = process.env.MINIO_WEBHOOK_SECRET;
    const tokenFromAuth = authorization?.replace(/^Bearer\s+/i, '');
    const providedSecret = secret ?? tokenFromAuth;
    if (expectedSecret && providedSecret !== expectedSecret) {
      throw new UnauthorizedException('Invalid webhook secret');
    }

    const record = body.Records?.[0];
    if (!record || body.EventName !== 's3:ObjectCreated:Put') {
      return { data: { processed: false } };
    }

    const s3 = record.s3;
    const location = decodeURIComponent(`${s3.bucket.name}/${s3.object.key}`);

    await this.fileUploadedUseCase.execute({
      fileUrl: `s3://${location}`,
      eTag: s3.object.eTag,
      size: s3.object.size,
      location,
      userMetadata: s3.object.userMetadata,
    });

    return { data: { processed: true } };
  }
}

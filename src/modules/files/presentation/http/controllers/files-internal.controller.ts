import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { FileUploadedUseCase } from '@modules/files/application/use-cases/file/file-uploaded.use-case';
import { InternalWebhookGuard } from '@modules/files/presentation/guards/internal-webhook.guard';
import { mapProcessMinioEventHttpResponse } from '../response/map-process-minio-event-response';

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
  @UseGuards(InternalWebhookGuard)
  async handleMinioEvent(@Body() body: MinioWebhookPayload) {
    const record = body.Records?.[0];
    if (!record || body.EventName !== 's3:ObjectCreated:Put') {
      return mapProcessMinioEventHttpResponse(false);
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

    return mapProcessMinioEventHttpResponse(true);
  }
}

import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { QUEUE_NAMES } from '@shared/infrastructure/queues/queue.constants';
import type { Job } from 'bullmq';
import { ProcessImageVariantsUseCase } from '../../application/use-cases/file/process-image-variants.use-case';
import type { ProcessImageVariantsJobData } from './bullmq-image-variants-queue.adapter';

@Processor(QUEUE_NAMES.IMAGE_VARIANTS)
export class ImageVariantsQueueProcessor extends WorkerHost {
  private readonly logger = new Logger(ImageVariantsQueueProcessor.name);

  constructor(
    private readonly processImageVariantsUseCase: ProcessImageVariantsUseCase,
  ) {
    super();
  }

  async process(job: Job<ProcessImageVariantsJobData>): Promise<unknown> {
    this.logger.log(
      `Processing image variants for fileId=${job.data.fileId} force=${Boolean(job.data.force)} (job=${job.id})`,
    );
    return this.processImageVariantsUseCase.execute({
      fileId: job.data.fileId,
      force: job.data.force,
    });
  }
}

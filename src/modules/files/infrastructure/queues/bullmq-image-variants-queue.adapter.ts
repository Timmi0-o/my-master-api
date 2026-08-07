import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import {
  QUEUE_JOB_NAMES,
  QUEUE_NAMES,
} from '@shared/infrastructure/queues/queue.constants';
import type { Queue } from 'bullmq';
import type {
  IEnqueueImageVariantsJobInput,
  IImageVariantsQueuePort,
} from '../../application/ports/i-image-variants-queue.port';

export type ProcessImageVariantsJobData = {
  fileId: string;
  force?: boolean;
};

@Injectable()
export class BullMqImageVariantsQueueAdapter implements IImageVariantsQueuePort {
  constructor(
    @InjectQueue(QUEUE_NAMES.IMAGE_VARIANTS)
    private readonly imageVariantsQueue: Queue<ProcessImageVariantsJobData>,
  ) {}

  async enqueueProcessImageVariants(
    input: IEnqueueImageVariantsJobInput,
  ): Promise<void> {
    const force = input.force === true;
    const jobId = force
      ? `image-variants-force-${input.fileId}`
      : `image-variants-${input.fileId}`;

    const existingJob = await this.imageVariantsQueue.getJob(jobId);
    if (existingJob) {
      const state = await existingJob.getState();
      if (state === 'completed' || state === 'failed' || force) {
        await existingJob.remove();
      }
    }

    await this.imageVariantsQueue.add(
      QUEUE_JOB_NAMES.PROCESS_IMAGE_VARIANTS,
      { fileId: input.fileId, ...(force ? { force: true } : {}) },
      {
        jobId,
        removeOnComplete: true,
        removeOnFail: 50,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      },
    );
  }
}

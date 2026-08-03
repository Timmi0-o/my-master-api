import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, type OnModuleInit } from '@nestjs/common';
import {
  QUEUE_JOB_NAMES,
  QUEUE_NAMES,
} from '@shared/infrastructure/queues/queue.constants';
import type { Queue } from 'bullmq';

@Injectable()
export class MasterOnboardingDemoteRepeatableRegistrar implements OnModuleInit {
  constructor(
    @InjectQueue(QUEUE_NAMES.MASTER_ONBOARDING_DEMOTE)
    private readonly queue: Queue,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.queue.add(
      QUEUE_JOB_NAMES.PROCESS_ONBOARDING_DEMOTE,
      {},
      {
        repeat: { every: 10 * 60_000 },
        jobId: 'master-onboarding-demote-repeatable',
        removeOnComplete: true,
        removeOnFail: 50,
      },
    );
  }
}

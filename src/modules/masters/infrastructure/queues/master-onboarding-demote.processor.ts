import { Processor, WorkerHost } from '@nestjs/bullmq';
import { QUEUE_NAMES } from '@shared/infrastructure/queues/queue.constants';
import type { Job } from 'bullmq';
import { CronProcessIncompleteAcceptingMastersUseCase } from '../../application/use-cases/master-profile/cron-process-incomplete-accepting-masters.use-case';

@Processor(QUEUE_NAMES.MASTER_ONBOARDING_DEMOTE)
export class MasterOnboardingDemoteProcessor extends WorkerHost {
  constructor(
    private readonly cronProcessIncompleteAcceptingMastersUseCase: CronProcessIncompleteAcceptingMastersUseCase,
  ) {
    super();
  }

  async process(_job: Job): Promise<unknown> {
    return this.cronProcessIncompleteAcceptingMastersUseCase.execute();
  }
}

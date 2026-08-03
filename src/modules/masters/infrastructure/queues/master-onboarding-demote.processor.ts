import { Processor, WorkerHost } from '@nestjs/bullmq';
import { QUEUE_NAMES } from '@shared/infrastructure/queues/queue.constants';
import type { Job } from 'bullmq';
import { ProcessIncompleteAcceptingMastersJobUseCase } from '../../application/use-cases/master-profile/jobs/process-incomplete-accepting-masters-job.use-case';

@Processor(QUEUE_NAMES.MASTER_ONBOARDING_DEMOTE)
export class MasterOnboardingDemoteProcessor extends WorkerHost {
  constructor(
    private readonly processIncompleteAcceptingMastersJobUseCase: ProcessIncompleteAcceptingMastersJobUseCase,
  ) {
    super();
  }

  async process(_job: Job): Promise<unknown> {
    return this.processIncompleteAcceptingMastersJobUseCase.execute();
  }
}

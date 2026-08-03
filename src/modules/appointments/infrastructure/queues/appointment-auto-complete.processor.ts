import { Processor, WorkerHost } from '@nestjs/bullmq';
import { QUEUE_NAMES } from '@shared/infrastructure/queues/queue.constants';
import type { Job } from 'bullmq';
import { ProcessDueAppointmentAutoCompletionsJobUseCase } from '../../application/use-cases/appointment/jobs/process-due-appointment-auto-completions-job.use-case';

@Processor(QUEUE_NAMES.APPOINTMENT_AUTO_COMPLETE)
export class AppointmentAutoCompleteProcessor extends WorkerHost {
  constructor(
    private readonly processDueAppointmentAutoCompletionsJobUseCase: ProcessDueAppointmentAutoCompletionsJobUseCase,
  ) {
    super();
  }

  async process(_job: Job): Promise<unknown> {
    return this.processDueAppointmentAutoCompletionsJobUseCase.execute();
  }
}

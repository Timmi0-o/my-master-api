import { Processor, WorkerHost } from '@nestjs/bullmq';
import { QUEUE_NAMES } from '@shared/infrastructure/queues/queue.constants';
import type { Job } from 'bullmq';
import { CronProcessDueAppointmentAutoCompletionsUseCase } from '../../application/use-cases/appointment/cron-process-due-appointment-auto-completions.use-case';

@Processor(QUEUE_NAMES.APPOINTMENT_AUTO_COMPLETE)
export class AppointmentAutoCompleteProcessor extends WorkerHost {
  constructor(
    private readonly cronProcessDueAppointmentAutoCompletionsUseCase: CronProcessDueAppointmentAutoCompletionsUseCase,
  ) {
    super();
  }

  async process(_job: Job): Promise<unknown> {
    return this.cronProcessDueAppointmentAutoCompletionsUseCase.execute();
  }
}

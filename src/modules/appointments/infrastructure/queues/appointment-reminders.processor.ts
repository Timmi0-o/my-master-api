import { Processor, WorkerHost } from '@nestjs/bullmq';
import { QUEUE_NAMES } from '@shared/infrastructure/queues/queue.constants';
import type { Job } from 'bullmq';
import { ProcessDueAppointmentRemindersJobUseCase } from '../../application/use-cases/appointment/jobs/process-due-appointment-reminders-job.use-case';

@Processor(QUEUE_NAMES.APPOINTMENT_REMINDERS)
export class AppointmentRemindersProcessor extends WorkerHost {
  constructor(
    private readonly processDueAppointmentRemindersJobUseCase: ProcessDueAppointmentRemindersJobUseCase,
  ) {
    super();
  }

  async process(_job: Job): Promise<unknown> {
    return this.processDueAppointmentRemindersJobUseCase.execute();
  }
}

import { Processor, WorkerHost } from '@nestjs/bullmq';
import { QUEUE_NAMES } from '@shared/infrastructure/queues/queue.constants';
import type { Job } from 'bullmq';
import { CronProcessDueAppointmentRemindersUseCase } from '../../application/use-cases/appointment/cron-process-due-appointment-reminders.use-case';

@Processor(QUEUE_NAMES.APPOINTMENT_REMINDERS)
export class AppointmentRemindersProcessor extends WorkerHost {
  constructor(
    private readonly cronProcessDueAppointmentRemindersUseCase: CronProcessDueAppointmentRemindersUseCase,
  ) {
    super();
  }

  async process(_job: Job): Promise<unknown> {
    return this.cronProcessDueAppointmentRemindersUseCase.execute();
  }
}

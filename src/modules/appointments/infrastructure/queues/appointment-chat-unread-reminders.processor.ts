import { Processor, WorkerHost } from '@nestjs/bullmq';
import { QUEUE_NAMES } from '@shared/infrastructure/queues/queue.constants';
import type { Job } from 'bullmq';
import { CronProcessAppointmentChatUnreadRemindersUseCase } from '../../application/use-cases/appointment-chat/cron-process-appointment-chat-unread-reminders.use-case';

@Processor(QUEUE_NAMES.APPOINTMENT_CHAT_UNREAD_REMINDERS)
export class AppointmentChatUnreadRemindersProcessor extends WorkerHost {
  constructor(
    private readonly cronProcessAppointmentChatUnreadRemindersUseCase: CronProcessAppointmentChatUnreadRemindersUseCase,
  ) {
    super();
  }

  async process(_job: Job): Promise<unknown> {
    return this.cronProcessAppointmentChatUnreadRemindersUseCase.execute();
  }
}

import { Processor, WorkerHost } from '@nestjs/bullmq';
import { QUEUE_NAMES } from '@shared/infrastructure/queues/queue.constants';
import type { Job } from 'bullmq';
import { ProcessAppointmentChatUnreadRemindersJobUseCase } from '../../application/use-cases/appointment-chat/jobs/process-appointment-chat-unread-reminders-job.use-case';

@Processor(QUEUE_NAMES.APPOINTMENT_CHAT_UNREAD_REMINDERS)
export class AppointmentChatUnreadRemindersProcessor extends WorkerHost {
  constructor(
    private readonly processAppointmentChatUnreadRemindersJobUseCase: ProcessAppointmentChatUnreadRemindersJobUseCase,
  ) {
    super();
  }

  async process(_job: Job): Promise<unknown> {
    return this.processAppointmentChatUnreadRemindersJobUseCase.execute();
  }
}

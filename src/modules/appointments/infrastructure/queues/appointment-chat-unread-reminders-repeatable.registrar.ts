import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, type OnModuleInit } from '@nestjs/common';
import {
  QUEUE_JOB_NAMES,
  QUEUE_NAMES,
} from '@shared/infrastructure/queues/queue.constants';
import type { Queue } from 'bullmq';

@Injectable()
export class AppointmentChatUnreadRemindersRepeatableRegistrar implements OnModuleInit {
  constructor(
    @InjectQueue(QUEUE_NAMES.APPOINTMENT_CHAT_UNREAD_REMINDERS)
    private readonly queue: Queue,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.queue.add(
      QUEUE_JOB_NAMES.PROCESS_CHAT_UNREAD_REMINDERS,
      {},
      {
        repeat: { every: 3 * 60 * 60_000 },
        jobId: 'appointment-chat-unread-reminders-repeatable',
        removeOnComplete: true,
        removeOnFail: 50,
      },
    );
  }
}

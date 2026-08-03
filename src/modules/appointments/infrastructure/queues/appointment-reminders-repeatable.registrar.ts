import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, type OnModuleInit } from '@nestjs/common';
import {
  QUEUE_JOB_NAMES,
  QUEUE_NAMES,
} from '@shared/infrastructure/queues/queue.constants';
import type { Queue } from 'bullmq';

@Injectable()
export class AppointmentRemindersRepeatableRegistrar implements OnModuleInit {
  constructor(
    @InjectQueue(QUEUE_NAMES.APPOINTMENT_REMINDERS)
    private readonly queue: Queue,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.queue.add(
      QUEUE_JOB_NAMES.PROCESS_DUE_REMINDERS,
      {},
      {
        repeat: { every: 60_000 },
        jobId: 'appointment-reminders-repeatable',
        removeOnComplete: true,
        removeOnFail: 50,
      },
    );
  }
}

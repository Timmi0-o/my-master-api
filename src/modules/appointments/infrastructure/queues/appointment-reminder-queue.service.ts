import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import {
  QUEUE_JOB_NAMES,
  QUEUE_NAMES,
} from '@shared/infrastructure/queues/queue.constants';
import type { Queue } from 'bullmq';
import { EAppointmentReminderJobType } from '../../domain/entities/appointment-reminder-job';

export type TAppointmentReminderDelayedJob = {
  appointmentId: string;
  type: EAppointmentReminderJobType;
  runAt: Date;
};

@Injectable()
export class AppointmentReminderQueueService {
  constructor(
    @InjectQueue(QUEUE_NAMES.APPOINTMENT_REMINDERS)
    private readonly queue: Queue,
  ) {}

  async syncDelayedJobs(jobs: TAppointmentReminderDelayedJob[]): Promise<void> {
    for (const job of jobs) {
      const jobId = this.getJobId(job.appointmentId, job.type);
      await this.queue.remove(jobId);
      await this.queue.add(
        QUEUE_JOB_NAMES.PROCESS_DUE_REMINDERS,
        {
          appointmentId: job.appointmentId,
          type: job.type,
        },
        {
          jobId,
          delay: Math.max(0, job.runAt.getTime() - Date.now()),
          removeOnComplete: true,
          removeOnFail: 50,
        },
      );
    }
  }

  async cancelByAppointmentId(appointmentId: string): Promise<void> {
    await Promise.all(
      Object.values(EAppointmentReminderJobType).map((type) =>
        this.queue.remove(this.getJobId(appointmentId, type)),
      ),
    );
  }

  private getJobId(
    appointmentId: string,
    type: EAppointmentReminderJobType,
  ): string {
    return `${appointmentId}-${type}`;
  }
}

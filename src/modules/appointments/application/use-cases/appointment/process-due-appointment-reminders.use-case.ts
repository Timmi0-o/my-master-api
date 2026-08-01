import { SendWebPushToUserUseCase } from '@modules/web-push-subscriptions/application/use-cases/web-push-subscription/send-web-push-to-user.use-case';
import { EAppointmentStatus } from 'src/modules/appointments/domain/entities/appointment';
import type { IAppointmentReminderJobEntity } from 'src/modules/appointments/domain/entities/appointment-reminder-job';
import type { IAppointmentReminderJobRepository } from 'src/modules/appointments/domain/repositories/appointment-reminder-job/i-appointment-reminder-job.repository';
import type { IAppointmentRepository } from 'src/modules/appointments/domain/repositories/appointment/i-appointment.repository';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import type { CreateNotificationUseCase } from 'src/modules/notifications/application/use-cases/notification/create-notification.use-case';
import {
  NotificationCategory,
  NotificationRelatedEntityType,
  NotificationType,
} from 'src/modules/notifications/domain/entities/notification';
import type { NotificationMessageCatalog } from 'src/modules/notifications/infrastructure/i18n/notification-message-catalog';
import { EUserLanguage } from 'src/modules/users/domain/entities/user';
import type { IUserRepository } from 'src/modules/users/domain/repositories/user/i-user.repository';

const DEFAULT_BATCH_SIZE = 50;
const MAX_ATTEMPTS = 3;

function retryBackoffMs(attempts: number): number {
  return attempts <= 1 ? 60_000 : 5 * 60_000;
}

export class ProcessDueAppointmentRemindersUseCase {
  constructor(
    private readonly appointmentReminderJobRepository: IAppointmentReminderJobRepository,
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
    private readonly userRepository: IUserRepository,
    private readonly createNotificationUseCase: CreateNotificationUseCase,
    private readonly sendWebPushToUserUseCase: SendWebPushToUserUseCase,
    private readonly notificationMessageCatalog: NotificationMessageCatalog,
  ) {}

  async execute(input?: { limit?: number; now?: Date }): Promise<{
    processed: number;
    sent: number;
    cancelled: number;
    failed: number;
  }> {
    const now = input?.now ?? new Date();

    const jobs = await this.appointmentReminderJobRepository.claimDueBatch(
      input?.limit ?? DEFAULT_BATCH_SIZE,
      now,
    );

    let sent = 0;
    let cancelled = 0;
    let failed = 0;

    for (const job of jobs) {
      const result = await this.processOne(job, now);
      if (result === 'sent') sent += 1;
      else if (result === 'cancelled') cancelled += 1;
      else failed += 1;
    }

    return {
      processed: jobs.length,
      sent,
      cancelled,
      failed,
    };
  }

  private async processOne(
    job: IAppointmentReminderJobEntity,
    now: Date,
  ): Promise<'sent' | 'cancelled' | 'failed'> {
    try {
      const appointment = await this.appointmentRepository.findEntityById(
        job.appointmentId,
      );

      if (
        !appointment ||
        appointment.deletedAt ||
        appointment.status !== EAppointmentStatus.CONFIRMED ||
        appointment.startsAt.getTime() <= now.getTime()
      ) {
        await this.appointmentReminderJobRepository.markCancelled(job.id);
        return 'cancelled';
      }

      const profile = await this.masterProfileRepository.findEntityById(
        appointment.masterProfileId,
      );
      if (!profile) {
        await this.appointmentReminderJobRepository.markCancelled(job.id);
        return 'cancelled';
      }

      const actionUrl = `/record/${appointment.id}`;
      const payload = {
        type: 'appointment_reminder',
        reminderType: job.type,
        appointmentId: appointment.id,
        url: actionUrl,
      };

      const recipientUserIds = [
        appointment.clientUserId,
        profile.userId,
      ].filter((userId, index, all) => all.indexOf(userId) === index);

      for (const userId of recipientUserIds) {
        const recipient = await this.userRepository.findEntityById(userId);
        const { title, body } = this.notificationMessageCatalog.resolve(
          recipient?.language ?? EUserLanguage.RU,
          {
            type: NotificationType.APPOINTMENT_REMINDER,
            serviceName: appointment.serviceName,
            reminderType: job.type,
          },
        );

        await this.createNotificationUseCase.execute({
          userId,
          actorUserId: null,
          category: NotificationCategory.APPOINTMENT,
          type: NotificationType.APPOINTMENT_REMINDER,
          title,
          body,
          actionUrl,
          relatedEntityType: NotificationRelatedEntityType.APPOINTMENT,
          relatedEntityId: appointment.id,
          payload,
          idempotencyKey: `appointment_reminder:${appointment.id}:${job.type}:${userId}`,
        });

        await this.sendWebPushToUserUseCase.execute({
          userId,
          title,
          body,
          data: payload,
        });
      }

      await this.appointmentReminderJobRepository.markSent(job.id, now);
      return 'sent';
    } catch (error) {
      const attempts = job.attempts + 1;
      const message = error instanceof Error ? error.message : String(error);
      const canRetry = attempts < MAX_ATTEMPTS;

      await this.appointmentReminderJobRepository.markFailedOrRetry({
        id: job.id,
        attempts,
        lastError: message.slice(0, 1000),
        retryAt: canRetry
          ? new Date(now.getTime() + retryBackoffMs(attempts))
          : null,
      });

      return 'failed';
    }
  }
}

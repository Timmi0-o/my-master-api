import { SendWebPushToUserUseCase } from '@modules/web-push-subscriptions/application/use-cases/web-push-subscription/send-web-push-to-user.use-case';
import type { ITransactionManager } from '@shared/domain/transactions';
import {
  EAppointmentStatus,
  ensureActorCanConfirmAppointment,
  ensureAppointmentAccessible,
  ensureAppointmentConfirmable,
  ensureAppointmentExists,
  type IUpdateAppointmentInput,
} from 'src/modules/appointments/domain/entities/appointment';
import type { ICreateAppointmentChatMessageInput } from 'src/modules/appointments/domain/entities/appointment-chat-message';
import { EAppointmentChatMessageActor } from 'src/modules/appointments/domain/entities/appointment-chat-message';
import type { IAppointmentChatMessageRepository } from 'src/modules/appointments/domain/repositories/appointment-chat-message/i-appointment-chat-message.repository';
import type { IAppointmentRepository } from 'src/modules/appointments/domain/repositories/appointment/i-appointment.repository';
import { ensureMasterProfileExists } from 'src/modules/masters/domain/entities/master-profile';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import type { CreateNotificationUseCase } from 'src/modules/notifications/application/use-cases/notification/create-notification.use-case';
import {
  NotificationCategory,
  NotificationRelatedEntityType,
  NotificationType,
} from 'src/modules/notifications/domain/entities/notification';
import type { IConfirmAppointmentApplicationInput } from '../../dtos/appointment/confirm-appointment.input';
import type { IConfirmAppointmentApplicationOutput } from '../../dtos/appointment/confirm-appointment.output';
import type { IAppointmentRealtimePublisher } from '../../ports/appointment/i-appointment-realtime.publisher';
import type { ScheduleAppointmentRemindersUseCase } from './schedule-appointment-reminders.use-case';

export class ConfirmAppointmentUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly appointmentChatMessageRepository: IAppointmentChatMessageRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
    private readonly realtimeAppointmentPublisher: IAppointmentRealtimePublisher,
    private readonly createNotificationUseCase: CreateNotificationUseCase,
    private readonly sendWebPushToUserUseCase: SendWebPushToUserUseCase,
    private readonly scheduleAppointmentRemindersUseCase: ScheduleAppointmentRemindersUseCase,
  ) {}

  async execute(
    input: IConfirmAppointmentApplicationInput,
  ): Promise<IConfirmAppointmentApplicationOutput> {
    const existing = await this.appointmentRepository.findEntityById(input.id);
    ensureAppointmentExists(existing, input.id);

    const profile = await this.masterProfileRepository.findEntityById(
      existing.masterProfileId,
    );
    ensureMasterProfileExists(profile, existing.masterProfileId);
    ensureAppointmentAccessible(existing, input.actor, profile.userId);
    ensureAppointmentConfirmable(existing);
    ensureActorCanConfirmAppointment(existing.id, input.actor, profile.userId);

    const patch: IUpdateAppointmentInput = {
      status: EAppointmentStatus.CONFIRMED,
    };

    const updated = await this.transactionManager.runInTransaction(
      async (scope) => {
        const appointment = await this.appointmentRepository.update(
          input.id,
          patch,
          scope,
        );

        if (appointment.chatId) {
          const systemMessageInput: ICreateAppointmentChatMessageInput = {
            chatId: appointment.chatId,
            senderUserId: null,
            actor: EAppointmentChatMessageActor.SYSTEM,
            body: 'Запись подтверждена',
          };
          await this.appointmentChatMessageRepository.create(
            systemMessageInput,
            scope,
          );
        }

        await this.scheduleAppointmentRemindersUseCase.execute({
          appointmentId: appointment.id,
          startsAt: appointment.startsAt,
          scope,
        });

        return appointment;
      },
    );

    const title = 'Запись подтверждена';
    const body = `Мастер подтвердил запись «${updated.serviceName}»`;
    const actionUrl = `/record/${updated.id}`;
    const payload = {
      type: 'appointment_confirmed',
      appointmentId: updated.id,
      url: actionUrl,
    };

    void this.createNotificationUseCase
      .execute({
        userId: updated.clientUserId,
        actorUserId: input.actor.userId,
        category: NotificationCategory.APPOINTMENT,
        type: NotificationType.APPOINTMENT_CONFIRMED,
        title,
        body,
        actionUrl,
        relatedEntityType: NotificationRelatedEntityType.APPOINTMENT,
        relatedEntityId: updated.id,
        payload,
        idempotencyKey: `appointment_confirmed:${updated.id}`,
      })
      .catch(() => undefined);

    void this.sendWebPushToUserUseCase.execute({
      userId: updated.clientUserId,
      title,
      body,
      data: payload,
    });

    await Promise.all([
      this.realtimeAppointmentPublisher.appointmentUpdated(updated, {
        recipientUserId: updated.clientUserId,
      }),
      this.realtimeAppointmentPublisher.appointmentUpdated(updated, {
        recipientUserId: profile.userId,
      }),
    ]);

    return updated;
  }
}

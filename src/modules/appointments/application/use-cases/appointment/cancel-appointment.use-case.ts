import { SendWebPushToUserUseCase } from '@modules/web-push-subscriptions/application/use-cases/web-push-subscription/send-web-push-to-user.use-case';
import type { ITransactionManager } from '@shared/domain/transactions';
import {
  EAppointmentCancelledBy,
  EAppointmentStatus,
  ensureActorCanCancelAppointment,
  ensureAppointmentAccessible,
  ensureAppointmentCancellable,
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
import type { ICancelAppointmentApplicationInput } from '../../dtos/appointment/cancel-appointment.input';
import type { ICancelAppointmentApplicationOutput } from '../../dtos/appointment/cancel-appointment.output';
import type { IAppointmentRealtimePublisher } from '../../ports/appointment/i-appointment-realtime.publisher';

function resolveCancelledBy(
  actor: ICancelAppointmentApplicationInput['actor'],
  clientUserId: string,
  masterProfileUserId: string,
): EAppointmentCancelledBy {
  if (actor.isStaffUser) {
    return EAppointmentCancelledBy.STAFF;
  }
  if (actor.userId === clientUserId) {
    return EAppointmentCancelledBy.CLIENT;
  }
  if (actor.userId === masterProfileUserId) {
    return EAppointmentCancelledBy.MASTER;
  }
  return EAppointmentCancelledBy.STAFF;
}

export class CancelAppointmentUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly appointmentChatMessageRepository: IAppointmentChatMessageRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
    private readonly realtimeAppointmentPublisher: IAppointmentRealtimePublisher,
    private readonly createNotificationUseCase: CreateNotificationUseCase,
    private readonly sendWebPushToUserUseCase: SendWebPushToUserUseCase,
  ) {}

  async execute(
    input: ICancelAppointmentApplicationInput,
  ): Promise<ICancelAppointmentApplicationOutput> {
    const existing = await this.appointmentRepository.findEntityById(input.id);
    ensureAppointmentExists(existing, input.id);

    const profile = await this.masterProfileRepository.findEntityById(
      existing.masterProfileId,
    );
    ensureMasterProfileExists(profile, existing.masterProfileId);
    ensureAppointmentAccessible(existing, input.actor, profile.userId);
    ensureAppointmentCancellable(existing);
    ensureActorCanCancelAppointment(existing, input.actor, profile.userId);

    const cancelledBy = resolveCancelledBy(
      input.actor,
      existing.clientUserId,
      profile.userId,
    );

    const patch: IUpdateAppointmentInput = {
      status: EAppointmentStatus.CANCELLED,
      cancelledAt: new Date(),
      cancelledBy,
      cancelReason: input.cancelReason?.trim() || null,
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
            body: 'Запись отменена',
          };
          await this.appointmentChatMessageRepository.create(
            systemMessageInput,
            scope,
          );
        }

        return appointment;
      },
    );

    const title = 'Запись отменена';
    const body = `Запись «${updated.serviceName}» отменена`;
    const actionUrl = `/record/${updated.id}`;
    const payload = {
      type: 'appointment_cancelled',
      appointmentId: updated.id,
      url: actionUrl,
    };

    const notifyUserIds =
      cancelledBy === EAppointmentCancelledBy.STAFF
        ? [updated.clientUserId, profile.userId]
        : cancelledBy === EAppointmentCancelledBy.CLIENT
          ? [profile.userId]
          : [updated.clientUserId];

    for (const userId of notifyUserIds) {
      void this.createNotificationUseCase
        .execute({
          userId,
          actorUserId: input.actor.userId,
          category: NotificationCategory.APPOINTMENT,
          type: NotificationType.APPOINTMENT_CANCELLED,
          title,
          body,
          actionUrl,
          relatedEntityType: NotificationRelatedEntityType.APPOINTMENT,
          relatedEntityId: updated.id,
          payload,
          idempotencyKey: `appointment_cancelled:${updated.id}:${userId}`,
        })
        .catch(() => undefined);

      void this.sendWebPushToUserUseCase.execute({
        userId,
        title,
        body,
        data: payload,
      });
    }

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

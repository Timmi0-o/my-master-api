import { SendWebPushToUserUseCase } from '@modules/web-push-subscriptions/application/use-cases/web-push-subscription/send-web-push-to-user.use-case';
import type { ITransactionManager } from '@shared/domain/transactions';
import {
  EAppointmentStatus,
  ensureActorCanMarkNoShow,
  ensureAppointmentAccessible,
  ensureAppointmentExists,
  ensureAppointmentNoShowable,
  type IUpdateAppointmentInput,
} from 'src/modules/appointments/domain/entities/appointment';
import type {
  IAppointmentChatMessageEntity,
  ICreateAppointmentChatMessageInput,
} from 'src/modules/appointments/domain/entities/appointment-chat-message';
import {
  EAppointmentChatMessageActor,
  EAppointmentChatSystemAction,
} from 'src/modules/appointments/domain/entities/appointment-chat-message';
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
import type { NotificationMessageCatalog } from 'src/modules/notifications/infrastructure/i18n/notification-message-catalog';
import { EUserLanguage } from 'src/modules/users/domain/entities/user';
import type { IUserRepository } from 'src/modules/users/domain/repositories/user/i-user.repository';
import type { INoShowAppointmentApplicationInput } from '../../dtos/appointment/no-show-appointment.input';
import type { INoShowAppointmentApplicationOutput } from '../../dtos/appointment/no-show-appointment.output';
import type { IAppointmentRealtimePublisher } from '../../ports/appointment/i-appointment-realtime.publisher';
import type { IAppointmentChatRealtimePublisher } from '../../ports/i-appointment-chat-realtime.publisher';
import type { CancelAppointmentRemindersUseCase } from './cancel-appointment-reminders.use-case';

export class NoShowAppointmentUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly appointmentChatMessageRepository: IAppointmentChatMessageRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
    private readonly userRepository: IUserRepository,
    private readonly realtimeAppointmentPublisher: IAppointmentRealtimePublisher,
    private readonly realtimeChatPublisher: IAppointmentChatRealtimePublisher,
    private readonly createNotificationUseCase: CreateNotificationUseCase,
    private readonly sendWebPushToUserUseCase: SendWebPushToUserUseCase,
    private readonly notificationMessageCatalog: NotificationMessageCatalog,
    private readonly cancelAppointmentRemindersUseCase: CancelAppointmentRemindersUseCase,
  ) {}

  async execute(
    input: INoShowAppointmentApplicationInput,
  ): Promise<INoShowAppointmentApplicationOutput> {
    const existing = await this.appointmentRepository.findEntityById(input.id);
    ensureAppointmentExists(existing, input.id);

    const profile = await this.masterProfileRepository.findEntityById(
      existing.masterProfileId,
    );
    ensureMasterProfileExists(profile, existing.masterProfileId);
    ensureAppointmentAccessible(existing, input.actor, profile.userId);
    ensureAppointmentNoShowable(existing);
    ensureActorCanMarkNoShow(existing.id, input.actor, profile.userId);

    const patch: IUpdateAppointmentInput = {
      status: EAppointmentStatus.NO_SHOW,
    };

    const result = await this.transactionManager.runInTransaction(
      async (scope) => {
        const appointment = await this.appointmentRepository.update(
          input.id,
          patch,
          scope,
        );

        let systemMessage: IAppointmentChatMessageEntity | null = null;
        if (appointment.chatId) {
          const systemMessageInput: ICreateAppointmentChatMessageInput = {
            chatId: appointment.chatId,
            senderUserId: null,
            actor: EAppointmentChatMessageActor.SYSTEM,
            body: null,
            systemAction: EAppointmentChatSystemAction.APPOINTMENT_NO_SHOW,
            payload: { serviceName: appointment.serviceName },
          };
          systemMessage = await this.appointmentChatMessageRepository.create(
            systemMessageInput,
            scope,
          );
        }

        await this.cancelAppointmentRemindersUseCase.execute({
          appointmentId: appointment.id,
          scope,
        });

        return { appointment, systemMessage };
      },
    );

    const updated = result.appointment;

    if (result.systemMessage) {
      await Promise.all([
        this.realtimeChatPublisher.messageCreated(result.systemMessage, {
          recipientUserId: updated.clientUserId,
        }),
        this.realtimeChatPublisher.messageCreated(result.systemMessage, {
          recipientUserId: profile.userId,
        }),
      ]);
    }

    const recipient = await this.userRepository.findEntityById(
      updated.clientUserId,
    );
    const { title, body } = this.notificationMessageCatalog.resolve(
      recipient?.language ?? EUserLanguage.RU,
      {
        type: NotificationType.APPOINTMENT_NO_SHOW,
        serviceName: updated.serviceName,
      },
    );
    const actionUrl = `/record/${updated.id}`;
    const payload = {
      type: 'appointment_no_show',
      appointmentId: updated.id,
      url: actionUrl,
    };

    void this.createNotificationUseCase
      .execute({
        userId: updated.clientUserId,
        actorUserId: input.actor.userId,
        category: NotificationCategory.APPOINTMENT,
        type: NotificationType.APPOINTMENT_NO_SHOW,
        title,
        body,
        actionUrl,
        relatedEntityType: NotificationRelatedEntityType.APPOINTMENT,
        relatedEntityId: updated.id,
        payload,
        idempotencyKey: `appointment_no_show:${updated.id}`,
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

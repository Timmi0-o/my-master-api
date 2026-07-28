import { ensureAppointmentStatusActive } from '@modules/appointments/domain/entities/appointment/policies/ensure-appointment-status-active.policy';
import type { ITransactionManager } from '@shared/domain/transactions';
import { ensureAppointmentExists } from 'src/modules/appointments/domain/entities/appointment';
import { ensureAppointmentChatExists } from 'src/modules/appointments/domain/entities/appointment-chat';
import type { ICreateAppointmentChatMessageInput } from 'src/modules/appointments/domain/entities/appointment-chat-message';
import { AppointmentChatMessageForbiddenError } from 'src/modules/appointments/domain/entities/appointment-chat-message';
import type { IAppointmentChatMessageRepository } from 'src/modules/appointments/domain/repositories/appointment-chat-message/i-appointment-chat-message.repository';
import type { IAppointmentChatRepository } from 'src/modules/appointments/domain/repositories/appointment-chat/i-appointment-chat.repository';
import type { IAppointmentRepository } from 'src/modules/appointments/domain/repositories/appointment/i-appointment.repository';
import { ensureMasterProfileExists } from 'src/modules/masters/domain/entities/master-profile';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import type { CreateNotificationUseCase } from 'src/modules/notifications/application/use-cases/notification/create-notification.use-case';
import {
  NotificationCategory,
  NotificationRelatedEntityType,
  NotificationType,
} from 'src/modules/notifications/domain/entities/notification';
import { ensureUsersNotBlocked } from 'src/modules/users/domain/entities/user-block';
import type { IUserBlockRepository } from 'src/modules/users/domain/repositories/user-block/i-user-block.repository';
import type { SendWebPushToUserUseCase } from 'src/modules/web-push-subscriptions/application/use-cases/web-push-subscription/send-web-push-to-user.use-case';
import type { ICreateAppointmentChatMessageApplicationInput } from '../../dtos/appointment-chat-message/create-appointment-chat-message.input';
import type { ICreateAppointmentChatMessageApplicationOutput } from '../../dtos/appointment-chat-message/create-appointment-chat-message.output';
import type { IAppointmentChatRealtimePublisher } from '../../ports/i-appointment-chat-realtime.publisher';

const WEB_PUSH_BODY_MAX_LENGTH = 120;

export class CreateAppointmentChatMessageUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly messageRepository: IAppointmentChatMessageRepository,
    private readonly appointmentChatRepository: IAppointmentChatRepository,
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
    private readonly realtimeChatPublisher: IAppointmentChatRealtimePublisher,
    private readonly userBlockRepository: IUserBlockRepository,
    private readonly createNotificationUseCase: CreateNotificationUseCase,
    private readonly sendWebPushToUserUseCase: SendWebPushToUserUseCase,
  ) {}

  async execute(
    input: ICreateAppointmentChatMessageApplicationInput,
  ): Promise<ICreateAppointmentChatMessageApplicationOutput> {
    const chat = await this.appointmentChatRepository.findEntityById(
      input.chatId,
    );
    ensureAppointmentChatExists(chat, input.chatId);

    const appointment = await this.appointmentRepository.findEntityById(
      chat.appointmentId,
    );
    ensureAppointmentExists(appointment, chat.appointmentId);

    ensureAppointmentStatusActive(appointment);

    const profile = await this.masterProfileRepository.findEntityById(
      appointment.masterProfileId,
    );
    ensureMasterProfileExists(profile, appointment.masterProfileId);

    const isClient = appointment.clientUserId === input.actor.userId;
    const isMaster = profile.userId === input.actor.userId;
    if (!input.actor.isStaffUser && !isClient && !isMaster) {
      throw new AppointmentChatMessageForbiddenError(input.chatId);
    }

    await ensureUsersNotBlocked(
      this.userBlockRepository,
      appointment.clientUserId,
      profile.userId,
    );

    const createInput: ICreateAppointmentChatMessageInput = {
      chatId: input.chatId,
      senderUserId: input.actor.userId,
      body: input.body,
    };

    const message = await this.transactionManager.runInTransaction((scope) =>
      this.messageRepository.create(createInput, scope),
    );

    const recipientUserId = isClient
      ? profile.userId
      : isMaster
        ? appointment.clientUserId
        : null;

    await this.realtimeChatPublisher.messageCreated(message, {
      recipientUserId,
    });

    if (recipientUserId) {
      const title = 'Новое сообщение';
      const body = truncateNotificationBody(message.body);
      const actionUrl = `/chat/${message.chatId}`;
      const payload = {
        type: 'appointment_chat_message',
        chatId: message.chatId,
        messageId: message.id,
        url: actionUrl,
      };

      void this.createNotificationUseCase
        .execute({
          userId: recipientUserId,
          actorUserId: input.actor.userId,
          category: NotificationCategory.CHAT,
          type: NotificationType.CHAT_MESSAGE,
          title,
          body,
          actionUrl,
          relatedEntityType:
            NotificationRelatedEntityType.APPOINTMENT_CHAT_MESSAGE,
          relatedEntityId: message.id,
          payload,
          idempotencyKey: `chat_message:${message.id}`,
        })
        .catch(() => undefined);

      void this.sendWebPushToUserUseCase.execute({
        userId: recipientUserId,
        title,
        body,
        data: payload,
      });
    }

    return message;
  }
}

function truncateNotificationBody(body: string): string {
  if (body.length <= WEB_PUSH_BODY_MAX_LENGTH) {
    return body;
  }

  return `${body.slice(0, WEB_PUSH_BODY_MAX_LENGTH - 1)}…`;
}

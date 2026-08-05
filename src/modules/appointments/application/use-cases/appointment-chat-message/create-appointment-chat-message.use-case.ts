import { ensureChatHasActiveAppointment } from '@modules/appointments/domain/entities/appointment/policies/ensure-chat-has-active-appointment.policy';
import type { ITransactionManager } from '@shared/domain/transactions';
import {
  ensureAppointmentChatAccessible,
  ensureAppointmentChatExists,
} from 'src/modules/appointments/domain/entities/appointment-chat';
import type { ICreateAppointmentChatMessageInput } from 'src/modules/appointments/domain/entities/appointment-chat-message';
import {
  AppointmentChatMessageForbiddenError,
  EAppointmentChatMessageActor,
} from 'src/modules/appointments/domain/entities/appointment-chat-message';
import {
  EAppointmentChatMessageAttachmentKind,
  ensureAttachmentCountWithinLimit,
  ensureFilesReadyForChatAttach,
  ensureMessageHasBodyOrAttachments,
  ensureVoiceMessageShape,
} from 'src/modules/appointments/domain/entities/appointment-chat-message-attachment';
import type { IAppointmentChatMessageRepository } from 'src/modules/appointments/domain/repositories/appointment-chat-message/i-appointment-chat-message.repository';
import type { IAppointmentChatRepository } from 'src/modules/appointments/domain/repositories/appointment-chat/i-appointment-chat.repository';
import type { IAppointmentRepository } from 'src/modules/appointments/domain/repositories/appointment/i-appointment.repository';
import { ResolveFileDisplayUrlUseCase } from 'src/modules/files/application/use-cases/file/resolve-file-display-url.use-case';
import {
  FileAccessPermission,
  FileAccessTargetType,
  FileStatus,
} from 'src/modules/files/domain/entities/file';
import type { IFileAccessRepository } from 'src/modules/files/domain/repositories/file-access/i-file-access.repository';
import type { IFileRepository } from 'src/modules/files/domain/repositories/file/i-file.repository';
import { ensureMasterProfileExists } from 'src/modules/masters/domain/entities/master-profile';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import { NotificationType } from 'src/modules/notifications/domain/entities/notification';
import type { NotificationMessageCatalog } from 'src/modules/notifications/infrastructure/i18n/notification-message-catalog';
import { EUserLanguage } from 'src/modules/users/domain/entities/user';
import { ensureUsersNotBlocked } from 'src/modules/users/domain/entities/user-block';
import type { IUserBlockRepository } from 'src/modules/users/domain/repositories/user-block/i-user-block.repository';
import type { IUserRepository } from 'src/modules/users/domain/repositories/user/i-user.repository';
import type { SendWebPushToUserUseCase } from 'src/modules/web-push-subscriptions/application/use-cases/web-push-subscription/send-web-push-to-user.use-case';
import type { ICreateAppointmentChatMessageApplicationInput } from '../../dtos/appointment-chat-message/create-appointment-chat-message.input';
import type { ICreateAppointmentChatMessageApplicationOutput } from '../../dtos/appointment-chat-message/create-appointment-chat-message.output';
import { enrichAppointmentChatMessageAttachmentDisplayUrls } from '../../helpers/enrich-appointment-chat-message-attachment-display-urls.helper';
import type { IAppointmentChatRealtimePublisher } from '../../ports/i-appointment-chat-realtime.publisher';

const WEB_PUSH_BODY_MAX_LENGTH = 120;

export class CreateAppointmentChatMessageUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly messageRepository: IAppointmentChatMessageRepository,
    private readonly appointmentChatRepository: IAppointmentChatRepository,
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
    private readonly userRepository: IUserRepository,
    private readonly realtimeChatPublisher: IAppointmentChatRealtimePublisher,
    private readonly userBlockRepository: IUserBlockRepository,
    private readonly sendWebPushToUserUseCase: SendWebPushToUserUseCase,
    private readonly notificationMessageCatalog: NotificationMessageCatalog,
    private readonly fileRepository: IFileRepository,
    private readonly fileAccessRepository: IFileAccessRepository,
    private readonly resolveFileDisplayUrlUseCase: ResolveFileDisplayUrlUseCase,
  ) {}

  async execute(
    input: ICreateAppointmentChatMessageApplicationInput,
  ): Promise<ICreateAppointmentChatMessageApplicationOutput> {
    const attachments = input.attachments ?? [];
    const body = input.body?.trim() ? input.body.trim() : null;

    ensureAttachmentCountWithinLimit(attachments.length);
    ensureMessageHasBodyOrAttachments(body, attachments);
    ensureVoiceMessageShape(body, attachments);

    const chat = await this.appointmentChatRepository.findEntityById(
      input.chatId,
    );
    ensureAppointmentChatExists(chat, input.chatId);

    const profile = await this.masterProfileRepository.findEntityById(
      chat.masterProfileId,
    );
    ensureMasterProfileExists(profile, chat.masterProfileId);
    ensureAppointmentChatAccessible(chat, input.actor, profile.userId);

    const isClient = chat.clientUserId === input.actor.userId;
    const isMaster = profile.userId === input.actor.userId;
    if (!input.actor.isStaffUser && !isClient && !isMaster) {
      throw new AppointmentChatMessageForbiddenError(input.chatId);
    }

    const appointments = await this.appointmentRepository.findMany({
      where: { chatId: chat.id },
    });
    ensureChatHasActiveAppointment(appointments, chat.id);

    await ensureUsersNotBlocked(
      this.userBlockRepository,
      chat.clientUserId,
      profile.userId,
    );

    let filesById = new Map<
      string,
      Awaited<ReturnType<IFileRepository['findEntitiesByIds']>>[number]
    >();

    if (attachments.length > 0) {
      const files = await this.fileRepository.findEntitiesByIds(
        attachments.map((attachment) => attachment.fileId),
      );
      filesById = new Map(files.map((file) => [file.id, file]));
      ensureFilesReadyForChatAttach({
        chatId: chat.id,
        actorUserId: input.actor.userId,
        attachments,
        filesById,
      });
    }

    const createInput: ICreateAppointmentChatMessageInput = {
      chatId: input.chatId,
      senderUserId: input.actor.userId,
      actor: EAppointmentChatMessageActor.USER,
      body,
      systemAction: null,
      payload: null,
      attachments: attachments.map((attachment) => ({
        fileId: attachment.fileId,
        kind: attachment.kind,
        sortOrder: attachment.sortOrder,
        durationMs: attachment.durationMs,
      })),
    };

    const participantUserIds = [chat.clientUserId, profile.userId];

    const message = await this.transactionManager.runInTransaction(
      async (scope) => {
        for (const attachment of attachments) {
          const file = filesById.get(attachment.fileId);
          if (!file) {
            continue;
          }

          const mimeType =
            attachment.mimeType?.trim() || file.mimeType || undefined;
          const sizeBytes =
            attachment.sizeBytes != null && attachment.sizeBytes > 0
              ? BigInt(attachment.sizeBytes)
              : undefined;

          if (
            file.status === FileStatus.PENDING ||
            mimeType ||
            sizeBytes != null
          ) {
            await this.fileRepository.update(
              file.id,
              {
                ...(mimeType ? { mimeType } : {}),
                ...(sizeBytes != null ? { fileSize: sizeBytes } : {}),
                status: FileStatus.UPLOADED,
              },
              scope,
            );
          }
        }

        const created = await this.messageRepository.create(createInput, scope);

        for (const attachment of attachments) {
          for (const targetUserId of participantUserIds) {
            const existing =
              await this.fileAccessRepository.findByFileIdAndTarget(
                attachment.fileId,
                FileAccessTargetType.USER,
                targetUserId,
                scope,
              );
            if (existing) {
              continue;
            }

            await this.fileAccessRepository.create(
              {
                fileId: attachment.fileId,
                targetType: FileAccessTargetType.USER,
                targetId: targetUserId,
                grantedBy: input.actor.userId,
                permissions: [
                  FileAccessPermission.READ,
                  FileAccessPermission.DOWNLOAD,
                ],
                reason: 'appointment-chat-message-attachment',
              },
              scope,
            );
          }
        }

        return created;
      },
    );

    const messageWithDisplayUrls =
      await enrichAppointmentChatMessageAttachmentDisplayUrls(
        message,
        this.resolveFileDisplayUrlUseCase,
      );

    const recipientUserId = isClient
      ? profile.userId
      : isMaster
        ? chat.clientUserId
        : null;

    await this.realtimeChatPublisher.messageCreated(messageWithDisplayUrls, {
      recipientUserId,
    });

    if (recipientUserId) {
      const recipient =
        await this.userRepository.findEntityById(recipientUserId);
      const pushBody = resolvePushNotificationBody(
        body,
        attachments.map((attachment) => attachment.kind),
      );
      if (pushBody) {
        const { title, body: notificationBody } =
          this.notificationMessageCatalog.resolve(
            recipient?.language ?? EUserLanguage.RU,
            {
              type: NotificationType.CHAT_MESSAGE,
              body: truncateNotificationBody(pushBody),
            },
          );
        const actionUrl = `/chat/${message.chatId}`;
        const payload = {
          type: 'appointment_chat_message',
          chatId: message.chatId,
          messageId: message.id,
          url: actionUrl,
        };

        void this.sendWebPushToUserUseCase.execute({
          userId: recipientUserId,
          title,
          body: notificationBody,
          data: payload,
        });
      }
    }

    return messageWithDisplayUrls;
  }
}

function resolvePushNotificationBody(
  body: string | null,
  kinds: readonly EAppointmentChatMessageAttachmentKind[],
): string | null {
  if (body) {
    return body;
  }

  if (kinds.length === 0) {
    return null;
  }

  if (
    kinds.length === 1 &&
    kinds[0] === EAppointmentChatMessageAttachmentKind.VOICE
  ) {
    return '🎤 Voice message';
  }

  if (
    kinds.every((kind) => kind === EAppointmentChatMessageAttachmentKind.IMAGE)
  ) {
    return '📷 Photo';
  }

  if (
    kinds.every((kind) => kind === EAppointmentChatMessageAttachmentKind.VIDEO)
  ) {
    return '🎬 Video';
  }

  return '📎 File';
}

function truncateNotificationBody(body: string): string {
  if (body.length <= WEB_PUSH_BODY_MAX_LENGTH) {
    return body;
  }

  return `${body.slice(0, WEB_PUSH_BODY_MAX_LENGTH - 1)}…`;
}

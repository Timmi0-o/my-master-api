import {
  EAppointmentChatMessageReplyPreviewStatus,
  type IAppointmentChatMessagePublicEntity,
} from 'src/modules/appointments/domain/entities/appointment-chat-message';
import type { EAppointmentChatMessageAttachmentKind } from 'src/modules/appointments/domain/entities/appointment-chat-message-attachment';
import type { IAppointmentChatMessageRepository } from 'src/modules/appointments/domain/repositories/appointment-chat-message/i-appointment-chat-message.repository';
import type { IAppointmentChatMessageWithAttachments } from './enrich-appointment-chat-message-attachment-display-urls.helper';

const REPLY_PREVIEW_BODY_MAX_LENGTH = 200;

export type IAppointmentChatMessageReplyToPreview = {
  id: string;
  status: EAppointmentChatMessageReplyPreviewStatus;
  senderUserId?: string | null;
  body?: string | null;
  createdAt?: Date;
  firstAttachmentKind?: EAppointmentChatMessageAttachmentKind | null;
};

export type IAppointmentChatMessageWithReplyTo =
  IAppointmentChatMessageWithAttachments & {
    replyTo?: IAppointmentChatMessageReplyToPreview | null;
  };

export function buildAppointmentChatMessageReplyToPreview(input: {
  replyToMessageId: string;
  replyTarget:
    | (IAppointmentChatMessagePublicEntity & {
        attachments?: Array<{ kind: EAppointmentChatMessageAttachmentKind }>;
      })
    | null
    | undefined;
  viewerUserId?: string;
}): IAppointmentChatMessageReplyToPreview {
  const { replyToMessageId, replyTarget, viewerUserId } = input;

  if (
    !replyTarget ||
    replyTarget.deletedAt != null ||
    (viewerUserId != null &&
      replyTarget.deletedForUserIds.includes(viewerUserId))
  ) {
    return {
      id: replyToMessageId,
      status: EAppointmentChatMessageReplyPreviewStatus.DELETED,
    };
  }

  const trimmedBody = replyTarget.body?.trim() || null;
  const body =
    trimmedBody && trimmedBody.length > REPLY_PREVIEW_BODY_MAX_LENGTH
      ? `${trimmedBody.slice(0, REPLY_PREVIEW_BODY_MAX_LENGTH - 1)}…`
      : trimmedBody;

  return {
    id: replyTarget.id,
    status: EAppointmentChatMessageReplyPreviewStatus.AVAILABLE,
    senderUserId: replyTarget.senderUserId,
    body,
    createdAt: replyTarget.createdAt,
    firstAttachmentKind: replyTarget.attachments?.[0]?.kind ?? null,
  };
}

export async function enrichAppointmentChatMessagesReplyTo(
  messages: readonly IAppointmentChatMessageWithAttachments[],
  messageRepository: IAppointmentChatMessageRepository,
  viewerUserId?: string,
): Promise<IAppointmentChatMessageWithReplyTo[]> {
  const replyToMessageIds = [
    ...new Set(
      messages
        .map((message) => message.replyToMessageId)
        .filter((id): id is string => Boolean(id)),
    ),
  ];

  const replyTargetsById =
    replyToMessageIds.length > 0
      ? await messageRepository.findEntitiesByIds(replyToMessageIds)
      : new Map<string, IAppointmentChatMessagePublicEntity>();

  return messages.map((message) => {
    if (!message.replyToMessageId) {
      return {
        ...message,
        replyTo: null,
      };
    }

    return {
      ...message,
      replyTo: buildAppointmentChatMessageReplyToPreview({
        replyToMessageId: message.replyToMessageId,
        replyTarget: replyTargetsById.get(message.replyToMessageId) ?? null,
        viewerUserId,
      }),
    };
  });
}

export async function enrichAppointmentChatMessageReplyTo(
  message: IAppointmentChatMessageWithAttachments,
  messageRepository: IAppointmentChatMessageRepository,
  viewerUserId?: string,
): Promise<IAppointmentChatMessageWithReplyTo> {
  const [enriched] = await enrichAppointmentChatMessagesReplyTo(
    [message],
    messageRepository,
    viewerUserId,
  );
  return enriched;
}

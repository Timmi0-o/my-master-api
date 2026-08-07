import type { IAppointmentChatMessagePublicEntity } from 'src/modules/appointments/domain/entities/appointment-chat-message';
import type { IAppointmentChatMessageAttachmentPublicEntity } from 'src/modules/appointments/domain/entities/appointment-chat-message-attachment';
import type { IAppointmentChatMessageReplyToPreview } from 'src/modules/appointments/application/helpers/enrich-appointment-chat-message-reply-to.helper';

export interface IAppointmentChatMessageAttachmentWsPayload {
  id: string;
  messageId: string;
  fileId: string;
  kind: string;
  sortOrder: number;
  durationMs: number | null;
  createdAt: string;
  updatedAt: string;
  file?: {
    id: string;
    fileUrl: string;
    originalName: string;
    mimeType: string;
    fileType: string;
    purpose: string;
    accessLevel: string;
    status: string;
    fileSize: number;
    createdAt: string;
    updatedAt: string;
  };
}

export interface IAppointmentChatMessageReplyToWsPayload {
  id: string;
  status: string;
  senderUserId?: string | null;
  body?: string | null;
  createdAt?: string | null;
  firstAttachmentKind?: string | null;
}

export interface IAppointmentChatMessageWsPayload extends Omit<
  IAppointmentChatMessagePublicEntity,
  'createdAt' | 'updatedAt' | 'editedAt' | 'deletedAt'
> {
  createdAt: string;
  updatedAt: string;
  editedAt: string | null;
  deletedAt?: string | null;
  attachments?: IAppointmentChatMessageAttachmentWsPayload[];
  replyTo?: IAppointmentChatMessageReplyToWsPayload | null;
}

function mapAttachmentToWsPayload(
  attachment: IAppointmentChatMessageAttachmentPublicEntity,
): IAppointmentChatMessageAttachmentWsPayload {
  return {
    id: attachment.id,
    messageId: attachment.messageId,
    fileId: attachment.fileId,
    kind: attachment.kind,
    sortOrder: attachment.sortOrder,
    durationMs: attachment.durationMs,
    createdAt: attachment.createdAt.toISOString(),
    updatedAt: attachment.updatedAt.toISOString(),
    ...(attachment.file
      ? {
          file: {
            id: attachment.file.id,
            fileUrl: attachment.file.fileUrl,
            originalName: attachment.file.originalName,
            mimeType: attachment.file.mimeType,
            fileType: attachment.file.fileType,
            purpose: attachment.file.purpose,
            accessLevel: attachment.file.accessLevel,
            status: attachment.file.status,
            fileSize: Number(attachment.file.fileSize),
            createdAt: attachment.file.createdAt.toISOString(),
            updatedAt: attachment.file.updatedAt.toISOString(),
          },
        }
      : {}),
  };
}

function mapReplyToToWsPayload(
  replyTo: IAppointmentChatMessageReplyToPreview | null | undefined,
): IAppointmentChatMessageReplyToWsPayload | null {
  if (!replyTo) {
    return null;
  }

  if (replyTo.status === 'DELETED') {
    return {
      id: replyTo.id,
      status: replyTo.status,
    };
  }

  return {
    id: replyTo.id,
    status: replyTo.status,
    senderUserId: replyTo.senderUserId ?? null,
    body: replyTo.body ?? null,
    createdAt: replyTo.createdAt?.toISOString() ?? null,
    firstAttachmentKind: replyTo.firstAttachmentKind ?? null,
  };
}

export function mapAppointmentChatMessageToWsPayload(
  message: IAppointmentChatMessagePublicEntity & {
    attachments?: IAppointmentChatMessageAttachmentPublicEntity[];
    replyTo?: IAppointmentChatMessageReplyToPreview | null;
  },
): IAppointmentChatMessageWsPayload {
  return {
    id: message.id,
    chatId: message.chatId,
    senderUserId: message.senderUserId,
    actor: message.actor,
    body: message.body,
    systemAction: message.systemAction,
    payload: message.payload,
    editedAt: message.editedAt?.toISOString() ?? null,
    editedHistory: message.editedHistory,
    deletedForUserIds: message.deletedForUserIds,
    replyToMessageId: message.replyToMessageId,
    createdAt: message.createdAt.toISOString(),
    updatedAt: message.updatedAt.toISOString(),
    deletedAt: message.deletedAt?.toISOString() ?? null,
    replyTo: mapReplyToToWsPayload(message.replyTo),
    attachments: (message.attachments ?? []).map(mapAttachmentToWsPayload),
  };
}

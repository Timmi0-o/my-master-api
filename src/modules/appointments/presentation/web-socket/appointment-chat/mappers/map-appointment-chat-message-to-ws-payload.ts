import type { IAppointmentChatMessagePublicEntity } from 'src/modules/appointments/domain/entities/appointment-chat-message';
import type { IAppointmentChatMessageAttachmentPublicEntity } from 'src/modules/appointments/domain/entities/appointment-chat-message-attachment';

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

export interface IAppointmentChatMessageWsPayload extends Omit<
  IAppointmentChatMessagePublicEntity,
  'createdAt' | 'updatedAt' | 'editedAt' | 'deletedAt'
> {
  createdAt: string;
  updatedAt: string;
  editedAt: string | null;
  deletedAt?: string | null;
  attachments?: IAppointmentChatMessageAttachmentWsPayload[];
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

export function mapAppointmentChatMessageToWsPayload(
  message: IAppointmentChatMessagePublicEntity & {
    attachments?: IAppointmentChatMessageAttachmentPublicEntity[];
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
    createdAt: message.createdAt.toISOString(),
    updatedAt: message.updatedAt.toISOString(),
    deletedAt: message.deletedAt?.toISOString() ?? null,
    attachments: (message.attachments ?? []).map(mapAttachmentToWsPayload),
  };
}

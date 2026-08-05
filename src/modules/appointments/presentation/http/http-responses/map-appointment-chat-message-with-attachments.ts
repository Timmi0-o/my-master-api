import type { IAppointmentChatMessageAttachmentPublicEntity } from 'src/modules/appointments/domain/entities/appointment-chat-message-attachment';
import type { IAppointmentChatMessagePublicEntity } from 'src/modules/appointments/domain/entities/appointment-chat-message';

function mapAttachmentFileToHttp(
  file: NonNullable<IAppointmentChatMessageAttachmentPublicEntity['file']>,
) {
  return {
    id: file.id,
    fileUrl: file.fileUrl,
    originalName: file.originalName,
    mimeType: file.mimeType,
    fileType: file.fileType,
    purpose: file.purpose,
    accessLevel: file.accessLevel,
    status: file.status,
    fileSize: Number(file.fileSize),
    createdAt: file.createdAt,
    updatedAt: file.updatedAt,
  };
}

export function mapAppointmentChatMessageAttachmentToHttp(
  attachment: IAppointmentChatMessageAttachmentPublicEntity,
) {
  return {
    id: attachment.id,
    messageId: attachment.messageId,
    fileId: attachment.fileId,
    kind: attachment.kind,
    sortOrder: attachment.sortOrder,
    durationMs: attachment.durationMs,
    createdAt: attachment.createdAt,
    updatedAt: attachment.updatedAt,
    ...(attachment.file
      ? { file: mapAttachmentFileToHttp(attachment.file) }
      : {}),
  };
}

/** Flat message DTO for list/window items (no `{ data }` envelope). */
export function mapAppointmentChatMessageWithAttachmentsToHttp(
  message: IAppointmentChatMessagePublicEntity & {
    attachments?: IAppointmentChatMessageAttachmentPublicEntity[];
  },
) {
  const { attachments, chat, sender, ...rest } = message as typeof message & {
    chat?: unknown;
    sender?: unknown;
  };

  return {
    ...rest,
    attachments: (attachments ?? []).map(
      mapAppointmentChatMessageAttachmentToHttp,
    ),
  };
}

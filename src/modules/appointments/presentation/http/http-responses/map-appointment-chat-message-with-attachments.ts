import type { IAppointmentChatMessageAttachmentPublicEntity } from 'src/modules/appointments/domain/entities/appointment-chat-message-attachment';
import type { IAppointmentChatMessagePublicEntity } from 'src/modules/appointments/domain/entities/appointment-chat-message';
import type { IAppointmentChatMessageReplyToPreview } from 'src/modules/appointments/application/helpers/enrich-appointment-chat-message-reply-to.helper';
import { parseImageVariantsFromMetadata } from 'src/modules/files/domain/entities/file';

function mapAttachmentFileToHttp(
  file: NonNullable<IAppointmentChatMessageAttachmentPublicEntity['file']>,
) {
  const variants = parseImageVariantsFromMetadata(file.metadata);

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
    ...(variants ? { variants } : {}),
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

function mapReplyToToHttp(
  replyTo: IAppointmentChatMessageReplyToPreview | null | undefined,
) {
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
    createdAt: replyTo.createdAt ?? null,
    firstAttachmentKind: replyTo.firstAttachmentKind ?? null,
  };
}

/** Flat message DTO for list/window items (no `{ data }` envelope). */
export function mapAppointmentChatMessageWithAttachmentsToHttp(
  message: IAppointmentChatMessagePublicEntity & {
    attachments?: IAppointmentChatMessageAttachmentPublicEntity[];
    replyTo?: IAppointmentChatMessageReplyToPreview | null;
  },
) {
  const { attachments, chat, sender, replyTo, ...rest } =
    message as typeof message & {
      chat?: unknown;
      sender?: unknown;
      replyTo?: IAppointmentChatMessageReplyToPreview | null;
    };

  return {
    ...rest,
    replyTo: mapReplyToToHttp(replyTo),
    attachments: (attachments ?? []).map(
      mapAppointmentChatMessageAttachmentToHttp,
    ),
  };
}

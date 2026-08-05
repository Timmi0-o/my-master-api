import type { IFileEntity } from 'src/modules/files/domain/entities/file';
import {
  FilePurpose,
  FileStatus,
} from 'src/modules/files/domain/entities/file';
import { AppointmentChatMessageAttachmentInvalidError } from '../errors/appointment-chat-message-attachment-invalid.error';
import type { ICreateAppointmentChatMessageAttachmentInput } from '../i-create-appointment-chat-message-attachment.input';
import { EAppointmentChatMessageAttachmentKind } from '../appointment-chat-message-attachment.enum';
import {
  APPOINTMENT_CHAT_ATTACHMENT_FILE_DEFAULTS,
  APPOINTMENT_CHAT_ATTACHMENT_OWNER_KIND,
} from './appointment-chat-message-attachment.constants';
import {
  ensureAttachmentFileSizeAllowed,
  ensureAttachmentMimeAllowed,
  ensureVoiceDurationAllowed,
} from './ensure-attachment-limits.policy';

export function ensureFilesReadyForChatAttach(input: {
  chatId: string;
  actorUserId: string;
  attachments: readonly ICreateAppointmentChatMessageAttachmentInput[];
  filesById: ReadonlyMap<string, IFileEntity>;
}): void {
  for (const attachment of input.attachments) {
    const file = input.filesById.get(attachment.fileId);
    if (!file) {
      throw new AppointmentChatMessageAttachmentInvalidError(
        `File not found: ${attachment.fileId}`,
      );
    }

    if (file.uploadedBy !== input.actorUserId) {
      throw new AppointmentChatMessageAttachmentInvalidError(
        'Attachment file must be uploaded by the message sender',
      );
    }

    if (file.purpose !== FilePurpose.APPOINTMENT_ATTACHMENT) {
      throw new AppointmentChatMessageAttachmentInvalidError(
        'Attachment file has invalid purpose',
      );
    }

    if (
      file.ownerKind !== APPOINTMENT_CHAT_ATTACHMENT_OWNER_KIND ||
      file.ownerId !== input.chatId
    ) {
      throw new AppointmentChatMessageAttachmentInvalidError(
        'Attachment file does not belong to this chat',
      );
    }

    if (
      file.accessLevel !== APPOINTMENT_CHAT_ATTACHMENT_FILE_DEFAULTS.accessLevel
    ) {
      throw new AppointmentChatMessageAttachmentInvalidError(
        'Attachment file has invalid access level',
      );
    }

    if (
      file.status !== FileStatus.PENDING &&
      file.status !== FileStatus.UPLOADED &&
      file.status !== FileStatus.READY
    ) {
      throw new AppointmentChatMessageAttachmentInvalidError(
        'Attachment file is not ready',
      );
    }

    const mimeType = (attachment.mimeType?.trim() || file.mimeType || '').trim();
    if (!mimeType) {
      throw new AppointmentChatMessageAttachmentInvalidError(
        'Attachment MIME type is required',
      );
    }
    ensureAttachmentMimeAllowed(attachment.kind, mimeType);

    const sizeBytes =
      attachment.sizeBytes != null && attachment.sizeBytes > 0
        ? attachment.sizeBytes
        : Number(file.fileSize);
    if (!Number.isFinite(sizeBytes) || sizeBytes <= 0) {
      throw new AppointmentChatMessageAttachmentInvalidError(
        'Attachment file size is required',
      );
    }
    ensureAttachmentFileSizeAllowed(attachment.kind, sizeBytes);

    if (attachment.kind === EAppointmentChatMessageAttachmentKind.VOICE) {
      ensureVoiceDurationAllowed(attachment.durationMs);
    }
  }
}

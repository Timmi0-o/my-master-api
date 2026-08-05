import { AppointmentChatMessageAttachmentInvalidError } from '../errors/appointment-chat-message-attachment-invalid.error';
import type { ICreateAppointmentChatMessageAttachmentInput } from '../i-create-appointment-chat-message-attachment.input';
import { EAppointmentChatMessageAttachmentKind } from '../appointment-chat-message-attachment.enum';
import {
  APPOINTMENT_CHAT_ATTACHMENT_MAX_BYTES,
  APPOINTMENT_CHAT_ATTACHMENT_MAX_COUNT_PER_MESSAGE,
  APPOINTMENT_CHAT_VOICE_MAX_DURATION_MS,
} from './appointment-chat-message-attachment.constants';
import { isMimeAllowedForAttachmentKind } from './resolve-attachment-kind-from-mime.policy';

export function ensureAttachmentCountWithinLimit(
  count: number,
): asserts count is number {
  if (count > APPOINTMENT_CHAT_ATTACHMENT_MAX_COUNT_PER_MESSAGE) {
    throw new AppointmentChatMessageAttachmentInvalidError(
      `Maximum ${APPOINTMENT_CHAT_ATTACHMENT_MAX_COUNT_PER_MESSAGE} attachments per message`,
    );
  }
}

export function ensureAttachmentFileSizeAllowed(
  kind: EAppointmentChatMessageAttachmentKind,
  fileSizeBytes: number,
): void {
  const maxBytes = APPOINTMENT_CHAT_ATTACHMENT_MAX_BYTES[kind];
  if (fileSizeBytes > maxBytes) {
    throw new AppointmentChatMessageAttachmentInvalidError(
      `File exceeds max size for ${kind}`,
    );
  }
}

export function ensureAttachmentMimeAllowed(
  kind: EAppointmentChatMessageAttachmentKind,
  mimeType: string,
): void {
  if (!isMimeAllowedForAttachmentKind(kind, mimeType)) {
    throw new AppointmentChatMessageAttachmentInvalidError(
      `MIME type not allowed for ${kind}`,
    );
  }
}

export function ensureVoiceDurationAllowed(durationMs: number | null | undefined): void {
  if (durationMs == null) {
    return;
  }
  if (durationMs <= 0 || durationMs > APPOINTMENT_CHAT_VOICE_MAX_DURATION_MS) {
    throw new AppointmentChatMessageAttachmentInvalidError(
      'Voice duration is out of allowed range',
    );
  }
}

export function ensureVoiceMessageShape(
  body: string | null | undefined,
  attachments: readonly ICreateAppointmentChatMessageAttachmentInput[],
): void {
  const hasVoice = attachments.some(
    (attachment) => attachment.kind === EAppointmentChatMessageAttachmentKind.VOICE,
  );
  if (!hasVoice) {
    return;
  }

  if (attachments.length !== 1) {
    throw new AppointmentChatMessageAttachmentInvalidError(
      'Voice message must contain exactly one voice attachment',
    );
  }

  const trimmedBody = body?.trim() ?? '';
  if (trimmedBody.length > 0) {
    throw new AppointmentChatMessageAttachmentInvalidError(
      'Voice message cannot include text body',
    );
  }

  ensureVoiceDurationAllowed(attachments[0]?.durationMs);
}

export function ensureMessageHasBodyOrAttachments(
  body: string | null | undefined,
  attachments: readonly ICreateAppointmentChatMessageAttachmentInput[],
): void {
  const trimmedBody = body?.trim() ?? '';
  if (trimmedBody.length === 0 && attachments.length === 0) {
    throw new AppointmentChatMessageAttachmentInvalidError(
      'Message must have text body or at least one attachment',
    );
  }
}

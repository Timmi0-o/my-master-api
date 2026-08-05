import { EAppointmentChatMessageAttachmentKind } from '../appointment-chat-message-attachment.enum';
import { APPOINTMENT_CHAT_ATTACHMENT_ALLOWED_MIME_TYPES } from './appointment-chat-message-attachment.constants';

function normalizeMimeType(mimeType: string): string {
  return mimeType.trim().toLowerCase();
}

export function resolveAttachmentKindFromMime(
  mimeType: string,
): EAppointmentChatMessageAttachmentKind | null {
  const normalized = normalizeMimeType(mimeType);

  for (const kind of Object.values(EAppointmentChatMessageAttachmentKind)) {
    const allowed = APPOINTMENT_CHAT_ATTACHMENT_ALLOWED_MIME_TYPES[kind];
    if (
      allowed.some(
        (entry) =>
          entry === normalized ||
          (entry.includes(';') === false && normalized.startsWith(`${entry};`)),
      )
    ) {
      return kind;
    }
  }

  return null;
}

export function isMimeAllowedForAttachmentKind(
  kind: EAppointmentChatMessageAttachmentKind,
  mimeType: string,
): boolean {
  const normalized = normalizeMimeType(mimeType);
  const allowed = APPOINTMENT_CHAT_ATTACHMENT_ALLOWED_MIME_TYPES[kind];

  return allowed.some(
    (entry) =>
      entry === normalized ||
      (entry.includes(';') === false && normalized.startsWith(`${entry};`)),
  );
}

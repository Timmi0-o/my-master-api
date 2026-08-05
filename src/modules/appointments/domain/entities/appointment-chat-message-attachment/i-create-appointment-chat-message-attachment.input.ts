import type { EAppointmentChatMessageAttachmentKind } from './appointment-chat-message-attachment.enum';

export interface ICreateAppointmentChatMessageAttachmentInput {
  fileId: string;
  kind: EAppointmentChatMessageAttachmentKind;
  sortOrder: number;
  durationMs?: number | null;
  /** Client-reported MIME after local File upload (file row may still be PENDING). */
  mimeType?: string | null;
  /** Client-reported size in bytes after local File upload. */
  sizeBytes?: number | null;
}

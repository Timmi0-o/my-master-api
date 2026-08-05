import type { EAppointmentChatMessageAttachmentKind } from 'src/modules/appointments/domain/entities/appointment-chat-message-attachment';

export interface ICreateAppointmentChatMessagePayload {
  chatId: string;
  body?: string | null;
  attachments?: Array<{
    fileId: string;
    kind: EAppointmentChatMessageAttachmentKind;
    sortOrder: number;
    durationMs?: number | null;
    mimeType?: string | null;
    sizeBytes?: number | null;
  }>;
}

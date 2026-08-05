import type { EAppointmentChatMessageAttachmentKind } from 'src/modules/appointments/domain/entities/appointment-chat-message-attachment';

export interface IPresignAppointmentChatAttachmentsPayload {
  files: Array<{
    name: string;
    sha256sum: string;
    mimeType: string;
    sizeBytes: number;
    kind: EAppointmentChatMessageAttachmentKind;
  }>;
}

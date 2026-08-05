import type { IAppointmentActorInput } from '../common/i-appointment-actor.input';
import type { EAppointmentChatMessageAttachmentKind } from 'src/modules/appointments/domain/entities/appointment-chat-message-attachment';

export interface IPresignAppointmentChatAttachmentFileInput {
  name: string;
  sha256sum: string;
  mimeType: string;
  sizeBytes: number;
  kind: EAppointmentChatMessageAttachmentKind;
}

export interface IPresignAppointmentChatAttachmentsApplicationInput {
  chatId: string;
  files: IPresignAppointmentChatAttachmentFileInput[];
  actor: IAppointmentActorInput;
}

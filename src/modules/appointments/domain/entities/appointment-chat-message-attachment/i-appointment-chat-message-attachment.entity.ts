import type { IFilePublicEntity } from 'src/modules/files/domain/entities/file';
import type { EAppointmentChatMessageAttachmentKind } from './appointment-chat-message-attachment.enum';

export interface IAppointmentChatMessageAttachmentEntity {
  id: string;
  messageId: string;
  fileId: string;
  kind: EAppointmentChatMessageAttachmentKind;
  sortOrder: number;
  durationMs: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export type IAppointmentChatMessageAttachmentPublicEntity =
  IAppointmentChatMessageAttachmentEntity & {
    file?: IFilePublicEntity;
  };

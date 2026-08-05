import type { IAppointmentChatMessageEntity } from './i-appointment-chat-message.entity';
import type { ICreateAppointmentChatMessageAttachmentInput } from '../appointment-chat-message-attachment';

export type ICreateAppointmentChatMessageInput = Omit<
  IAppointmentChatMessageEntity,
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt'
  | 'editedAt'
  | 'editedHistory'
  | 'deletedForUserIds'
> & {
  attachments?: readonly ICreateAppointmentChatMessageAttachmentInput[];
};

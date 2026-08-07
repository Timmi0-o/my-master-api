import type { IAppointmentChatMessageAttachmentEntity } from './i-appointment-chat-message-attachment.entity';

export const APPOINTMENT_CHAT_MESSAGE_ATTACHMENT_SELECT_FIELDS = [
  'id',
  'messageId',
  'fileId',
  'kind',
  'sortOrder',
  'durationMs',
  'createdAt',
  'updatedAt',
] as const satisfies readonly (keyof IAppointmentChatMessageAttachmentEntity)[];

export const APPOINTMENT_CHAT_MESSAGE_ATTACHMENT_STAFF_ONLY_FIELDS =
  [] as const satisfies readonly (keyof IAppointmentChatMessageAttachmentEntity)[];

export const APPOINTMENT_CHAT_MESSAGE_ATTACHMENT_FILE_SELECT_FIELDS = [
  'id',
  'fileUrl',
  'originalName',
  'mimeType',
  'fileType',
  'purpose',
  'accessLevel',
  'status',
  'fileSize',
  'metadata',
  'createdAt',
  'updatedAt',
] as const;

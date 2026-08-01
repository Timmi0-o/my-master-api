import type { IAppointmentChatMessagePublicEntity } from './i-appointment-chat-message.entity';

export const APPOINTMENT_CHAT_MESSAGE_SELECT_FIELDS = [
  'id',
  'chatId',
  'senderUserId',
  'actor',
  'body',
  'systemAction',
  'payload',
  'createdAt',
  'updatedAt',
  'deletedAt',
] as const satisfies readonly (keyof IAppointmentChatMessagePublicEntity)[];

export const APPOINTMENT_CHAT_MESSAGE_STAFF_ONLY_FIELDS = [
  'deletedAt',
] as const satisfies readonly (keyof IAppointmentChatMessagePublicEntity)[];

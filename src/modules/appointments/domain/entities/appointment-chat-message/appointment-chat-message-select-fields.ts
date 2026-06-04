import type { IAppointmentChatMessagePublicEntity } from './i-appointment-chat-message-entity';

export const APPOINTMENT_CHAT_MESSAGE_SELECT_FIELDS = [
  'id',
  'chatId',
  'senderUserId',
  'body',
  'createdAt',
  'updatedAt',
  'deletedAt',
] as const satisfies readonly (keyof IAppointmentChatMessagePublicEntity)[];

import type { ICreateAppointmentChatMessageInput } from './i-create-appointment-chat-message.input';

export type IUpdateAppointmentChatMessageInput = Partial<
  Omit<ICreateAppointmentChatMessageInput, 'chatId' | 'senderUserId'>
>;

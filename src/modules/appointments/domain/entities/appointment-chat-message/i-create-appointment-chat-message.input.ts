import type { IAppointmentChatMessageEntity } from './i-appointment-chat-message.entity';

export type ICreateAppointmentChatMessageInput = Omit<
  IAppointmentChatMessageEntity,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

import type { IAppointmentChatEntity } from './i-appointment-chat.entity';

export type ICreateAppointmentChatInput = Omit<
  IAppointmentChatEntity,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

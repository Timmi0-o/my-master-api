import type { IAppointmentChatPublicEntity } from './i-appointment-chat.entity';

export const APPOINTMENT_CHAT_SELECT_FIELDS = [
  'id',
  'appointmentId',
  'createdAt',
  'updatedAt',
  'deletedAt',
] as const satisfies readonly (keyof IAppointmentChatPublicEntity)[];

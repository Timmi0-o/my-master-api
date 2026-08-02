import type { IAppointmentChatPublicEntity } from './i-appointment-chat.entity';

export const APPOINTMENT_CHAT_SELECT_FIELDS = [
  'id',
  'masterProfileId',
  'clientUserId',
  'clientLastReadAt',
  'masterLastReadAt',
  'createdAt',
  'updatedAt',
  'deletedAt',
] as const satisfies readonly (keyof IAppointmentChatPublicEntity)[];

export const APPOINTMENT_CHAT_STAFF_ONLY_FIELDS = [
  'deletedAt',
] as const satisfies readonly (keyof IAppointmentChatPublicEntity)[];

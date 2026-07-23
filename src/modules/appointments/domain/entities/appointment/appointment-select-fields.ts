import type { IAppointmentPublicEntity } from './i-appointment.entity';

export const APPOINTMENT_SELECT_FIELDS = [
  'id',
  'masterProfileId',
  'masterServiceId',
  'clientUserId',
  'startsAt',
  'durationMinutes',
  'status',
  'totalPrice',
  'serviceName',
  'cancelledAt',
  'cancelledBy',
  'cancelReason',
  'isEarlyCompletionByMaster',
  'isEarlyCompletionByClient',
  'createdAt',
  'updatedAt',
  'deletedAt',
] as const satisfies readonly (keyof IAppointmentPublicEntity)[];

import type { IAppointmentEntity } from './i-appointment.entity';

export type ICreateAppointmentInput = Omit<
  IAppointmentEntity,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

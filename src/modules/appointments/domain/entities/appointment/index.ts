export type { IAppointmentEntity, IAppointmentPublicEntity } from './i-appointment.entity';
export type { ICreateAppointmentInput } from './i-create-appointment.input';
export type { IUpdateAppointmentInput } from './i-update-appointment.input';
export type { IAppointmentRelations } from './i-appointment-relations';
export { EAppointmentStatus, EAppointmentCancelledBy } from './appointment.enum';
export { AppointmentNotFoundError, AppointmentForbiddenError } from './errors';
export {
  ensureAppointmentExists,
  ensureAppointmentAccessible,
  type IAppointmentActor,
} from './policies';

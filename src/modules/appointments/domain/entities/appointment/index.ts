export type { IAppointmentEntity, IAppointmentPublicEntity } from './i-appointment.entity';
export type { ICreateAppointmentInput } from './i-create-appointment.input';
export type { IUpdateAppointmentInput } from './i-update-appointment.input';
export type { IAppointmentRelations } from './i-appointment-relations';
export { EAppointmentStatus, EAppointmentCancelledBy } from './appointment.enum';
export {
  NO_SHOW_LATE_MINUTES,
  NO_SHOW_LATE_MS,
} from './appointment-no-show.constants';
export {
  AppointmentNotAvailableError,
  AppointmentNotFoundError,
  AppointmentForbiddenError,
  AppointmentNotCompletableError,
  AppointmentNotConfirmableError,
  AppointmentNotCancellableError,
  AppointmentNotNoShowableError,
} from './errors';
export {
  ensureAppointmentExists,
  ensureAppointmentAccessible,
  ensureAppointmentCompletable,
  ensureAppointmentConfirmable,
  ensureAppointmentCancellable,
  ensureAppointmentNoShowable,
  ensureActorCanConfirmAppointment,
  ensureActorCanCancelAppointment,
  ensureActorCanMarkNoShow,
  ensureChatHasActiveAppointment,
  isAppointmentEarlyCompletion,
  isAppointmentNoShowEligible,
  getAppointmentNoShowEligibleAt,
  isAppointmentDueForAutoComplete,
  getAppointmentEndsAt,
  APPOINTMENT_IN_PROGRESS_STATUSES,
  isAppointmentInProgress,
  type IAppointmentActor,
} from './policies';

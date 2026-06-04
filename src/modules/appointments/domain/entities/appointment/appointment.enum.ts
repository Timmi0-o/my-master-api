export enum EAppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  NO_SHOW = 'NO_SHOW',
}

export enum EAppointmentCancelledBy {
  CLIENT = 'CLIENT',
  MASTER = 'MASTER',
  STAFF = 'STAFF',
}

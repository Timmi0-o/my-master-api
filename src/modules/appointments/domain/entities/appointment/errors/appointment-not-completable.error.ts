import { DomainError } from '@shared/domain/errors';

export class AppointmentNotCompletableError extends DomainError {
  constructor(appointmentId: string, status: string) {
    super(
      'APPOINTMENT_NOT_COMPLETABLE',
      'Appointment cannot be completed in its current status',
      { appointmentId, status },
    );
  }
}

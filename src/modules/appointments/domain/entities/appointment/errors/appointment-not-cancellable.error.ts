import { DomainError } from '@shared/domain/errors';

export class AppointmentNotCancellableError extends DomainError {
  constructor(appointmentId: string, status: string) {
    super(
      'APPOINTMENT_NOT_CANCELLABLE',
      'Appointment cannot be cancelled in its current status',
      { appointmentId, status },
    );
  }
}

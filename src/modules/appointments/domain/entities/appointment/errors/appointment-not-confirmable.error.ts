import { DomainError } from '@shared/domain/errors';

export class AppointmentNotConfirmableError extends DomainError {
  constructor(appointmentId: string, status: string) {
    super(
      'APPOINTMENT_NOT_CONFIRMABLE',
      'Appointment cannot be confirmed in its current status',
      { appointmentId, status },
    );
  }
}

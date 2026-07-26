import { DomainError } from '@shared/domain/errors';

export class AppointmentForbiddenError extends DomainError {
  constructor(appointmentId: string, message?: string) {
    super(
      'APPOINTMENT_FORBIDDEN',
      message ? message : 'Appointment access forbidden',
      {
        appointmentId,
      },
    );
  }
}

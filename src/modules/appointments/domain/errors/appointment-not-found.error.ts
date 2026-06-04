import { DomainError } from 'src/modules/shared/domain/errors';

export class AppointmentNotFoundError extends DomainError {
  constructor(appointmentId: string) {
    super('APPOINTMENT_NOT_FOUND', 'Appointment not found', {
      appointmentId,
    });
  }
}

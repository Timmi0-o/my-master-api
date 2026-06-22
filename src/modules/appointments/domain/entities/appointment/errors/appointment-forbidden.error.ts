import { DomainError } from '@shared/domain/errors';

export class AppointmentForbiddenError extends DomainError {
  constructor(appointmentId: string) {
    super('APPOINTMENT_FORBIDDEN', 'Appointment access forbidden', { appointmentId });
  }
}

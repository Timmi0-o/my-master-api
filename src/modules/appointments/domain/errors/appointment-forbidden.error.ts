import { DomainError } from 'src/modules/shared/domain/errors';

export class AppointmentForbiddenError extends DomainError {
  constructor(appointmentId: string) {
    super('APPOINTMENT_FORBIDDEN', 'Access to appointment is forbidden', {
      appointmentId,
    });
  }
}

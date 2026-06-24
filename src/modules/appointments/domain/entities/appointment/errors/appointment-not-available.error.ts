import { DomainError } from '@shared/domain/errors';

export class AppointmentNotAvailableError extends DomainError {
  constructor(startsAt: Date) {
    super('APPOINTMENT_NOT_AVAILABLE', 'Appointment slot is not available', {
      startsAt: startsAt.toISOString(),
    });
  }
}

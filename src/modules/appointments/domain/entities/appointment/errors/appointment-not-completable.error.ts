import { DomainError } from '@shared/domain/errors';

export class AppointmentNotCompletableError extends DomainError {
  constructor(
    appointmentId: string,
    reason: 'status' | 'not_started',
    details?: Record<string, unknown>,
  ) {
    super(
      'APPOINTMENT_NOT_COMPLETABLE',
      reason === 'not_started'
        ? 'Appointment cannot be completed before it starts'
        : 'Appointment cannot be completed in its current status',
      { appointmentId, reason, ...details },
    );
  }
}

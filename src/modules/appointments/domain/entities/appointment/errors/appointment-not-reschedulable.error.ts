import { DomainError } from '@shared/domain/errors';

export class AppointmentNotReschedulableError extends DomainError {
  constructor(
    appointmentId: string,
    reason: 'status' | 'already_started',
    details?: Record<string, unknown>,
  ) {
    super(
      'APPOINTMENT_NOT_RESCHEDULABLE',
      reason === 'already_started'
        ? 'Appointment cannot be rescheduled after it has started'
        : 'Appointment cannot be rescheduled in its current status',
      { appointmentId, reason, ...details },
    );
  }
}

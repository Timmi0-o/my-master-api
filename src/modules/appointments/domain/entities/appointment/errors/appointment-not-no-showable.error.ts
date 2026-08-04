import { DomainError } from '@shared/domain/errors';
import { NO_SHOW_LATE_MINUTES } from '../policies/appointment-no-show.constants';

export class AppointmentNotNoShowableError extends DomainError {
  constructor(
    appointmentId: string,
    reason: 'status' | 'too_early',
    details?: Record<string, unknown>,
  ) {
    super(
      'APPOINTMENT_NOT_NO_SHOWABLE',
      reason === 'too_early'
        ? `NO_SHOW is available only ${NO_SHOW_LATE_MINUTES} minutes after the appointment start`
        : 'Appointment cannot be marked as NO_SHOW in its current status',
      { appointmentId, reason, lateMinutes: NO_SHOW_LATE_MINUTES, ...details },
    );
  }
}

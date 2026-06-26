import { DomainError } from '@shared/domain/errors';

export class MasterServiceReviewAppointmentNotCompletedError extends DomainError {
  constructor(appointmentId: string) {
    super(
      'MASTER_SERVICE_REVIEW_APPOINTMENT_NOT_COMPLETED',
      'Appointment must be completed before leaving a review',
      { appointmentId },
    );
  }
}

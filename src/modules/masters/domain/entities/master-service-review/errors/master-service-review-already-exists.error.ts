import { DomainError } from '@shared/domain/errors';

export class MasterServiceReviewAlreadyExistsError extends DomainError {
  constructor(appointmentId: string) {
    super(
      'MASTER_SERVICE_REVIEW_ALREADY_EXISTS',
      'Review for this appointment already exists',
      { appointmentId },
    );
  }
}

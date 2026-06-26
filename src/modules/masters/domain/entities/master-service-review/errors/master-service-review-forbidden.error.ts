import { DomainError } from '@shared/domain/errors';

export class MasterServiceReviewForbiddenError extends DomainError {
  constructor(masterServiceReviewId: string) {
    super(
      'MASTER_SERVICE_REVIEW_FORBIDDEN',
      'Master service review access forbidden',
      { masterServiceReviewId },
    );
  }
}

import { DomainError } from '@shared/domain/errors';

export class MasterServiceReviewNotFoundError extends DomainError {
  constructor(masterServiceReviewId: string) {
    super('MASTER_SERVICE_REVIEW_NOT_FOUND', 'Master service review not found', {
      masterServiceReviewId,
    });
  }
}

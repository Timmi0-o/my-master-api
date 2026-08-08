import { DomainError } from '@shared/domain/errors';

export class MasterServiceReviewBlockedError extends DomainError {
  constructor(masterServiceReviewId: string) {
    super('MASTER_SERVICE_REVIEW_BLOCKED', 'Master service review is blocked', {
      masterServiceReviewId,
    });
  }
}

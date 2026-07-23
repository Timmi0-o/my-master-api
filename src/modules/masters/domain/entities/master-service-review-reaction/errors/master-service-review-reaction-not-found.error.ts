import { DomainError } from '@shared/domain/errors';

export class MasterServiceReviewReactionNotFoundError extends DomainError {
  constructor(masterServiceReviewReactionId: string) {
    super(
      'MASTER_SERVICE_REVIEW_REACTION_NOT_FOUND',
      'Master service review reaction not found',
      { masterServiceReviewReactionId },
    );
  }
}

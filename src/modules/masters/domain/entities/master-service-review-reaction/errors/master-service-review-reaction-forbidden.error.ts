import { DomainError } from '@shared/domain/errors';

export class MasterServiceReviewReactionForbiddenError extends DomainError {
  constructor(masterServiceReviewReactionId?: string) {
    super(
      'MASTER_SERVICE_REVIEW_REACTION_FORBIDDEN',
      'Master service review reaction access forbidden',
      masterServiceReviewReactionId ? { masterServiceReviewReactionId } : {},
    );
  }
}

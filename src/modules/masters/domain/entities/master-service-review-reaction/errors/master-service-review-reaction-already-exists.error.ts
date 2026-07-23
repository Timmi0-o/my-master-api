import { DomainError } from '@shared/domain/errors';

export class MasterServiceReviewReactionAlreadyExistsError extends DomainError {
  constructor(userId: string, masterServiceReviewId: string) {
    super(
      'MASTER_SERVICE_REVIEW_REACTION_ALREADY_EXISTS',
      'Reaction for this master service review already exists',
      { userId, masterServiceReviewId },
    );
  }
}

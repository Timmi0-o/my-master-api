import { DomainError } from '@shared/domain/errors';

export class MasterServiceReviewInvalidRatingError extends DomainError {
  constructor(rating: number) {
    super(
      'MASTER_SERVICE_REVIEW_INVALID_RATING',
      'Rating must be between 1 and 5',
      { rating },
    );
  }
}

import type { IMasterServiceReviewEntity } from '../i-master-service-review.entity';
import { MasterServiceReviewForbiddenError } from '../errors';
import type { IMasterServiceReviewActor } from './master-service-review-actor.types';

export function ensureMasterServiceReviewModifiable(
  review: IMasterServiceReviewEntity,
  actor: IMasterServiceReviewActor,
): void {
  if (actor.isStaffUser) {
    return;
  }

  if (review.clientUserId === actor.userId) {
    return;
  }

  throw new MasterServiceReviewForbiddenError(review.id);
}

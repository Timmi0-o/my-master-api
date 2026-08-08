import type { IMasterServiceReviewEntity } from '../i-master-service-review.entity';
import {
  MasterServiceReviewBlockedError,
  MasterServiceReviewForbiddenError,
} from '../errors';
import { EMasterServiceReviewStatus } from '../master-service-review-status.enum';
import type { IMasterServiceReviewActor } from './master-service-review-actor.types';

export function ensureMasterServiceReviewModifiable(
  review: IMasterServiceReviewEntity,
  actor: IMasterServiceReviewActor,
): void {
  if (actor.isStaffUser) {
    return;
  }

  if (review.status === EMasterServiceReviewStatus.BLOCKED) {
    throw new MasterServiceReviewBlockedError(review.id);
  }

  if (review.clientUserId === actor.userId) {
    return;
  }

  throw new MasterServiceReviewForbiddenError(review.id);
}

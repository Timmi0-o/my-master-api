import type { IMasterServiceReviewReactionEntity } from '../i-master-service-review-reaction.entity';
import { MasterServiceReviewReactionForbiddenError } from '../errors';
import type { IMasterServiceReviewReactionActor } from './master-service-review-reaction-actor.types';

export function ensureMasterServiceReviewReactionModifiable(
  reaction: IMasterServiceReviewReactionEntity,
  actor: IMasterServiceReviewReactionActor,
): void {
  if (actor.isStaffUser) {
    return;
  }

  if (reaction.userId === actor.userId) {
    return;
  }

  throw new MasterServiceReviewReactionForbiddenError(reaction.id);
}

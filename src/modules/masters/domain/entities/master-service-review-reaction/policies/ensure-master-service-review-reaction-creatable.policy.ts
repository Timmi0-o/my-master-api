import type { IMasterServiceReviewReactionEntity } from '../i-master-service-review-reaction.entity';
import { MasterServiceReviewReactionAlreadyExistsError } from '../errors';

export function ensureMasterServiceReviewReactionCreatable(
  existing: IMasterServiceReviewReactionEntity | null | undefined,
  userId: string,
  masterServiceReviewId: string,
): void {
  if (existing && existing.deletedAt == null) {
    throw new MasterServiceReviewReactionAlreadyExistsError(
      userId,
      masterServiceReviewId,
    );
  }
}

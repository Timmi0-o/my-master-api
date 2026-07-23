import type { IMasterServiceReviewReactionEntity } from '../i-master-service-review-reaction.entity';
import { MasterServiceReviewReactionNotFoundError } from '../errors';

export function ensureMasterServiceReviewReactionExists(
  entity: IMasterServiceReviewReactionEntity | null | undefined,
  id: string,
): asserts entity is IMasterServiceReviewReactionEntity {
  if (!entity) {
    throw new MasterServiceReviewReactionNotFoundError(id);
  }
}

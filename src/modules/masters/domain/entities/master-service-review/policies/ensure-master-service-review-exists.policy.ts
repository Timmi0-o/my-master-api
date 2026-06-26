import type { IMasterServiceReviewEntity } from '../i-master-service-review.entity';
import { MasterServiceReviewNotFoundError } from '../errors';

export function ensureMasterServiceReviewExists(
  entity: IMasterServiceReviewEntity | null | undefined,
  id: string,
): asserts entity is IMasterServiceReviewEntity {
  if (!entity) {
    throw new MasterServiceReviewNotFoundError(id);
  }
}

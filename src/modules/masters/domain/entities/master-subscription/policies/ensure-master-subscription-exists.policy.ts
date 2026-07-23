import type { IMasterSubscriptionEntity } from '../i-master-subscription.entity';
import { MasterSubscriptionNotFoundError } from '../errors';

export function ensureMasterSubscriptionExists(
  entity: IMasterSubscriptionEntity | null | undefined,
  id: string,
): asserts entity is IMasterSubscriptionEntity {
  if (!entity) {
    throw new MasterSubscriptionNotFoundError(id);
  }
}

import type { IMasterSubscriptionEntity } from '../i-master-subscription.entity';
import { MasterSubscriptionForbiddenError } from '../errors';
import type { IMasterSubscriptionActor } from './master-subscription-actor.types';

export function ensureMasterSubscriptionModifiable(
  subscription: IMasterSubscriptionEntity,
  actor: IMasterSubscriptionActor,
): void {
  if (actor.isStaffUser) {
    return;
  }

  if (subscription.userId === actor.userId) {
    return;
  }

  throw new MasterSubscriptionForbiddenError(subscription.id);
}

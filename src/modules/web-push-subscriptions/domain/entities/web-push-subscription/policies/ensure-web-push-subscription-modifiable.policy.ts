import { WebPushSubscriptionForbiddenError } from '../errors';
import type { IWebPushSubscriptionEntity } from '../i-web-push-subscription.entity';
import type { IWebPushSubscriptionActor } from './web-push-subscription-actor.types';

export function ensureWebPushSubscriptionModifiable(
  subscription: IWebPushSubscriptionEntity,
  actor: IWebPushSubscriptionActor,
): void {
  if (actor.isStaffUser) {
    return;
  }

  if (subscription.userId === actor.userId) {
    return;
  }

  throw new WebPushSubscriptionForbiddenError(subscription.id);
}

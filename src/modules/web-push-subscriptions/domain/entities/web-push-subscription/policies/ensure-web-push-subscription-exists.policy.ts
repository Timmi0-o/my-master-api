import { WebPushSubscriptionNotFoundError } from '../errors';
import type { IWebPushSubscriptionEntity } from '../i-web-push-subscription.entity';

export function ensureWebPushSubscriptionExists(
  subscription: IWebPushSubscriptionEntity | null,
  webPushSubscriptionId: string,
): asserts subscription is IWebPushSubscriptionEntity {
  if (!subscription || subscription.deletedAt != null) {
    throw new WebPushSubscriptionNotFoundError(webPushSubscriptionId);
  }
}

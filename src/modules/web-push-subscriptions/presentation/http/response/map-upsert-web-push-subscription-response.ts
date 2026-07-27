import type { IUpsertWebPushSubscriptionApplicationOutput } from 'src/modules/web-push-subscriptions/application/dtos/web-push-subscription/upsert-web-push-subscription.output';
import { mapWebPushSubscriptionHttpResponse } from './map-web-push-subscription-http-response';

export function mapUpsertWebPushSubscriptionHttpResponse(
  output: IUpsertWebPushSubscriptionApplicationOutput,
) {
  return mapWebPushSubscriptionHttpResponse(output);
}

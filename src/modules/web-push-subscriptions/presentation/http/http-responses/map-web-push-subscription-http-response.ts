import type { IWebPushSubscriptionPublicEntity } from 'src/modules/web-push-subscriptions/domain/entities/web-push-subscription';
import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/http-responses/map-entity-http-response';

export function mapWebPushSubscriptionHttpResponse(
  entity: IWebPushSubscriptionPublicEntity,
) {
  return mapEntityHttpResponse(entity);
}

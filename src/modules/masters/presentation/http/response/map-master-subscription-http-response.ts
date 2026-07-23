import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/response/map-entity-http-response';
import type { IMasterSubscriptionPublicEntity } from 'src/modules/masters/domain/entities/master-subscription';

export function mapMasterSubscriptionHttpResponse(
  entity: IMasterSubscriptionPublicEntity,
) {
  return mapEntityHttpResponse(entity);
}

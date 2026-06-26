import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/response/map-entity-http-response';
import type { IMasterServiceReviewPublicEntity } from 'src/modules/masters/domain/entities/master-service-review';

export function mapMasterServiceReviewHttpResponse(
  entity: IMasterServiceReviewPublicEntity,
) {
  return mapEntityHttpResponse(entity);
}

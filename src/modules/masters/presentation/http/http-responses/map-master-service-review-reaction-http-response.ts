import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/http-responses/map-entity-http-response';
import type { IMasterServiceReviewReactionPublicEntity } from 'src/modules/masters/domain/entities/master-service-review-reaction';

export function mapMasterServiceReviewReactionHttpResponse(
  entity: IMasterServiceReviewReactionPublicEntity,
) {
  return mapEntityHttpResponse(entity);
}

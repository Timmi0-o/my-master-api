import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/http-responses/map-entity-http-response';
import type { IMasterServiceReviewPublicEntity } from 'src/modules/masters/domain/entities/master-service-review';

export function mapMasterServiceReviewStatusActionHttpResponse(
  output: IMasterServiceReviewPublicEntity,
) {
  return mapEntityHttpResponse(output);
}

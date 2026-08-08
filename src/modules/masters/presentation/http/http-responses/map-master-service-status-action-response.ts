import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/http-responses/map-entity-http-response';
import type { IMasterServicePublicEntity } from 'src/modules/masters/domain/entities/master-service';

export function mapMasterServiceStatusActionHttpResponse(
  output: IMasterServicePublicEntity,
) {
  return mapEntityHttpResponse(output);
}

import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/response/map-entity-http-response';
import type { IFavoriteMasterServicePublicEntity } from 'src/modules/masters/domain/entities/favorite-master-service';

export function mapFavoriteMasterServiceHttpResponse(
  entity: IFavoriteMasterServicePublicEntity,
) {
  return mapEntityHttpResponse(entity);
}

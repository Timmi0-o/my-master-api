import type { IMasterServicePublicEntity } from 'src/modules/masters/domain/entities/master-service';
import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/response/map-entity-http-response';
import { mapMasterServiceToHttpResponse } from './map-master-service-http-response';

export type IGetMasterServiceByIdHttpResponse = ReturnType<
  typeof mapGetMasterServiceByIdHttpResponse
>;

export function mapGetMasterServiceByIdHttpResponse(
  output: IMasterServicePublicEntity,
) {
  return mapEntityHttpResponse(mapMasterServiceToHttpResponse(output));
}

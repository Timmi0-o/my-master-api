import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/http-responses/map-entity-http-response';
import type { IMasterServicePublicEntity } from 'src/modules/masters/domain/entities/master-service';

export type IUpdateMasterServiceHttpResponse = ReturnType<typeof mapUpdateMasterServiceHttpResponse>;

export function mapUpdateMasterServiceHttpResponse(output: IMasterServicePublicEntity) {
  return mapEntityHttpResponse(output);
}

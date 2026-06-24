import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/response/map-entity-http-response';
import type { IMasterServicePublicEntity } from 'src/modules/masters/domain/entities/master-service';

export type ICreateMasterServiceHttpResponse = ReturnType<typeof mapCreateMasterServiceHttpResponse>;

export function mapCreateMasterServiceHttpResponse(output: IMasterServicePublicEntity) {
  return mapEntityHttpResponse(output);
}

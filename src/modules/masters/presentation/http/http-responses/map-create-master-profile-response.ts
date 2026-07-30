import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/http-responses/map-entity-http-response';
import type { IMasterProfilePublicEntity } from 'src/modules/masters/domain/entities/master-profile';

export type ICreateMasterProfileHttpResponse = ReturnType<typeof mapCreateMasterProfileHttpResponse>;

export function mapCreateMasterProfileHttpResponse(output: IMasterProfilePublicEntity) {
  return mapEntityHttpResponse(output);
}

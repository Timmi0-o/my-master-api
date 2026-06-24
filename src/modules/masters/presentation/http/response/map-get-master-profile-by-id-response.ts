import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/response/map-entity-http-response';
import type { IMasterProfilePublicEntity } from 'src/modules/masters/domain/entities/master-profile';

export type IGetMasterProfileByIdHttpResponse = ReturnType<typeof mapGetMasterProfileByIdHttpResponse>;

export function mapGetMasterProfileByIdHttpResponse(output: IMasterProfilePublicEntity) {
  return mapEntityHttpResponse(output);
}

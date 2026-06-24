import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/response/map-entity-http-response';
import type { IMasterProfilePublicEntity } from 'src/modules/masters/domain/entities/master-profile';
import { mapMasterProfileToHttpResponse } from './map-master-profile-http-response';

export type IGetMasterProfileByIdHttpResponse = ReturnType<typeof mapGetMasterProfileByIdHttpResponse>;

export function mapGetMasterProfileByIdHttpResponse(output: IMasterProfilePublicEntity) {
  return mapEntityHttpResponse(mapMasterProfileToHttpResponse(output));
}

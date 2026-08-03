import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/http-responses/map-entity-http-response';
import type { IGetMasterProfileByIdApplicationOutput } from 'src/modules/masters/application/dtos/master-profile/get-master-profile-by-id.output';
import { mapMasterProfileToHttpResponse } from './map-master-profile-http-response';

export type IGetMasterProfileByIdHttpResponse = ReturnType<
  typeof mapGetMasterProfileByIdHttpResponse
>;

export function mapGetMasterProfileByIdHttpResponse(
  output: IGetMasterProfileByIdApplicationOutput,
) {
  return mapEntityHttpResponse(mapMasterProfileToHttpResponse(output));
}

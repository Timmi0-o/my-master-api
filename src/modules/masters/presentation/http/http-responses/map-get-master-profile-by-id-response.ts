import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/http-responses/map-entity-http-response';
import type { WithPersonalNote } from 'src/modules/users/application/helpers/attach-personal-notes.helper';
import type { IMasterProfilePublicEntity } from 'src/modules/masters/domain/entities/master-profile';
import { mapMasterProfileToHttpResponse } from './map-master-profile-http-response';

export type IGetMasterProfileByIdHttpResponse = ReturnType<
  typeof mapGetMasterProfileByIdHttpResponse
>;

export function mapGetMasterProfileByIdHttpResponse(
  output: WithPersonalNote<IMasterProfilePublicEntity>,
) {
  return mapEntityHttpResponse(mapMasterProfileToHttpResponse(output));
}

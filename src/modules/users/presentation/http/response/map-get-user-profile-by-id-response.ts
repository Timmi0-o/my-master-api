import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/response/map-entity-http-response';
import type { IGetUserProfileByIdApplicationOutput } from 'src/modules/users/application/dtos/user-profile/get-user-profile-by-id.output';
import { mapUserProfileToHttpResponse } from './map-user-profile-http-response';

export type IGetUserProfileByIdHttpResponse = ReturnType<
  typeof mapGetUserProfileByIdHttpResponse
>;

export function mapGetUserProfileByIdHttpResponse(
  output: IGetUserProfileByIdApplicationOutput,
) {
  return mapEntityHttpResponse(mapUserProfileToHttpResponse(output));
}

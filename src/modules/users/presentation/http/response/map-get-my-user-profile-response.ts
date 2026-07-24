import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/response/map-entity-http-response';
import type { IGetMyUserProfileApplicationOutput } from 'src/modules/users/application/dtos/user-profile/get-my-user-profile.output';
import { mapUserProfileToHttpResponse } from './map-user-profile-http-response';

export type IGetMyUserProfileHttpResponse = ReturnType<typeof mapGetMyUserProfileHttpResponse>;

export function mapGetMyUserProfileHttpResponse(
  output: IGetMyUserProfileApplicationOutput,
) {
  return mapEntityHttpResponse(
    output != null ? mapUserProfileToHttpResponse(output) : output,
  );
}

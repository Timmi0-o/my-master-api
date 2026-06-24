import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/response/map-entity-http-response';
import type { IGetMyUserProfileApplicationOutput } from 'src/modules/users/application/dtos/user-profile/get-my-user-profile.output';

export type IGetMyUserProfileHttpResponse = ReturnType<typeof mapGetMyUserProfileHttpResponse>;

export function mapGetMyUserProfileHttpResponse(
  output: IGetMyUserProfileApplicationOutput,
) {
  return mapEntityHttpResponse(output);
}

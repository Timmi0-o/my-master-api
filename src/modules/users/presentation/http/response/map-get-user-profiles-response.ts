import { buildPaginatedListResponse } from 'src/modules/shared/presentation/http/response/build-paginated-list-response';
import type { GetUserProfilesOutput } from 'src/modules/users/application/dtos/user-profile/get-user-profiles.output';
import type { IGetUserProfilesQueryPayload } from '../validation/schemas/get-user-profiles-query.types';
import { mapUserProfilesToHttpResponse } from './map-user-profile-http-response';

export type IGetUserProfilesHttpResponse = ReturnType<
  typeof mapGetUserProfilesHttpResponse
>;

export function mapGetUserProfilesHttpResponse(
  output: GetUserProfilesOutput,
  payload: IGetUserProfilesQueryPayload,
) {
  return buildPaginatedListResponse({
    items: mapUserProfilesToHttpResponse(output.items),
    totalCount: output.total,
    page: payload.page,
    limit: payload.limit,
  });
}

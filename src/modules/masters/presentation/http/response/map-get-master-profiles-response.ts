import { buildPaginatedListResponse } from 'src/modules/shared/presentation/http/response/build-paginated-list-response';
import type { GetMasterProfilesOutput } from 'src/modules/masters/application/dtos/master-profile/get-master-profiles.output';
import type { IGetMasterProfilesQueryPayload } from '../validation/schemas/get-master-profiles-query.types';
import { mapMasterProfilesToHttpResponse } from './map-master-profile-http-response';

export type IGetMasterProfilesHttpResponse = ReturnType<
  typeof mapGetMasterProfilesHttpResponse
>;

export function mapGetMasterProfilesHttpResponse(
  output: GetMasterProfilesOutput,
  payload: IGetMasterProfilesQueryPayload,
) {
  return buildPaginatedListResponse({
    items: mapMasterProfilesToHttpResponse(output.items),
    totalCount: output.total,
    page: payload.page,
    limit: payload.limit,
  });
}

import { buildPaginatedListResponse } from 'src/modules/shared/presentation/http/response/build-paginated-list-response';
import type { GetFavoriteMasterServicesOutput } from 'src/modules/masters/application/dtos/favorite-master-service/get-favorite-master-services.output';
import type { IGetFavoriteMasterServicesQueryPayload } from '../validation/schemas/get-favorite-master-services-query.types';

export function mapGetFavoriteMasterServicesHttpResponse(
  output: GetFavoriteMasterServicesOutput,
  payload: IGetFavoriteMasterServicesQueryPayload,
) {
  return buildPaginatedListResponse({
    items: output.items,
    totalCount: output.total,
    page: payload.page,
    limit: payload.limit,
  });
}

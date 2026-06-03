import { buildPaginatedListResponse } from 'src/modules/shared/presentation/http/response/build-paginated-list-response';
import type { GetMasterServicesOutput } from 'src/modules/masters/application/dtos/master-service/get-master-services.output';
import type { IGetMasterServicesQueryPayload } from '../validation/schemas/get-master-services-query.types';

export type IGetMasterServicesHttpResponse = ReturnType<
  typeof mapGetMasterServicesHttpResponse
>;

export function mapGetMasterServicesHttpResponse(
  output: GetMasterServicesOutput,
  payload: IGetMasterServicesQueryPayload,
) {
  return buildPaginatedListResponse({
    items: output.items,
    totalCount: output.total,
    page: payload.page,
    limit: payload.limit,
  });
}

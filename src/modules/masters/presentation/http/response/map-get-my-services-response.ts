import type { IGetMyServicesApplicationOutput } from 'src/modules/masters/application/dtos/master-service/get-my-services.output';
import { buildPaginatedListResponse } from 'src/modules/shared/presentation/http/response/build-paginated-list-response';
import type { IGetMyServicesQueryPayload } from '../validation/schemas/get-my-services-query.types';
import { mapMasterServicesToHttpResponse } from './map-master-service-http-response';

export type IGetMyServicesHttpResponse = ReturnType<
  typeof mapGetMyServicesHttpResponse
>;

export function mapGetMyServicesHttpResponse(
  output: IGetMyServicesApplicationOutput,
  payload: IGetMyServicesQueryPayload,
) {
  return buildPaginatedListResponse({
    items: mapMasterServicesToHttpResponse(output.items),
    totalCount: output.total,
    page: payload.page,
    limit: payload.limit,
  });
}

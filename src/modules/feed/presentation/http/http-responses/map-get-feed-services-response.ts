import type { IGetFeedServicesApplicationOutput } from 'src/modules/feed/application/dtos/i-get-feed-services-output.dto';
import { mapMasterServicesToHttpResponse } from 'src/modules/masters/presentation/http/http-responses/map-master-service-http-response';
import { buildPaginatedListResponse } from 'src/modules/shared/presentation/http/http-responses/build-paginated-list-response';

export function mapGetFeedServicesHttpResponse(
  output: IGetFeedServicesApplicationOutput,
  page: number,
  limit: number,
) {
  return buildPaginatedListResponse({
    items: mapMasterServicesToHttpResponse(output.items),
    totalCount: output.total,
    page,
    limit,
  });
}

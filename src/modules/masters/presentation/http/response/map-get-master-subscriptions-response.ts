import { buildPaginatedListResponse } from 'src/modules/shared/presentation/http/response/build-paginated-list-response';
import type { GetMasterSubscriptionsOutput } from 'src/modules/masters/application/dtos/master-subscription/get-master-subscriptions.output';
import type { IGetMasterSubscriptionsQueryPayload } from '../validation/schemas/get-master-subscriptions-query.types';

export function mapGetMasterSubscriptionsHttpResponse(
  output: GetMasterSubscriptionsOutput,
  payload: IGetMasterSubscriptionsQueryPayload,
) {
  return buildPaginatedListResponse({
    items: output.items,
    totalCount: output.total,
    page: payload.page,
    limit: payload.limit,
  });
}

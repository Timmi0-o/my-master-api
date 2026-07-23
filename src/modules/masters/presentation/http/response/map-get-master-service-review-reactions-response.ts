import { buildPaginatedListResponse } from 'src/modules/shared/presentation/http/response/build-paginated-list-response';
import type { GetMasterServiceReviewReactionsOutput } from 'src/modules/masters/application/dtos/master-service-review-reaction/get-master-service-review-reactions.output';
import type { IGetMasterServiceReviewReactionsQueryPayload } from '../validation/schemas/get-master-service-review-reactions-query.types';

export function mapGetMasterServiceReviewReactionsHttpResponse(
  output: GetMasterServiceReviewReactionsOutput,
  payload: IGetMasterServiceReviewReactionsQueryPayload,
) {
  return buildPaginatedListResponse({
    items: output.items,
    totalCount: output.total,
    page: payload.page,
    limit: payload.limit,
  });
}

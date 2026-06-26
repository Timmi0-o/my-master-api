import { buildPaginatedListResponse } from 'src/modules/shared/presentation/http/response/build-paginated-list-response';
import type { GetMasterServiceReviewsOutput } from 'src/modules/masters/application/dtos/master-service-review/get-master-service-reviews.output';
import type { IGetMasterServiceReviewsQueryPayload } from '../validation/schemas/get-master-service-reviews-query.types';

export function mapGetMasterServiceReviewsHttpResponse(
  output: GetMasterServiceReviewsOutput,
  payload: IGetMasterServiceReviewsQueryPayload,
) {
  return buildPaginatedListResponse({
    items: output.items,
    totalCount: output.total,
    page: payload.page,
    limit: payload.limit,
  });
}

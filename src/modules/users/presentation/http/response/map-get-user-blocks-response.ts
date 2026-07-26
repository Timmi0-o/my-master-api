import { buildPaginatedListResponse } from 'src/modules/shared/presentation/http/response/build-paginated-list-response';
import type { GetUserBlocksOutput } from 'src/modules/users/application/dtos/user-block/get-user-blocks.output';
import type { IGetUserBlocksQueryPayload } from '../validation/schemas/get-user-blocks-query.types';

export function mapGetUserBlocksHttpResponse(
  output: GetUserBlocksOutput,
  payload: IGetUserBlocksQueryPayload,
) {
  return buildPaginatedListResponse({
    items: output.items,
    totalCount: output.total,
    page: payload.page,
    limit: payload.limit,
  });
}

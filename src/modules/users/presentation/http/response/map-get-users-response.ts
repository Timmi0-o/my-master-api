import { buildPaginatedListResponse } from 'src/modules/shared/presentation/http/response/build-paginated-list-response';
import type { GetUsersOutput } from 'src/modules/users/application/dtos/user/get-users.output';
import type { IGetUsersQueryPayload } from '../validation/schemas/get-users-query.types';

export type IGetUsersHttpResponse = ReturnType<typeof mapGetUsersHttpResponse>;

export function mapGetUsersHttpResponse(
  output: GetUsersOutput,
  payload: IGetUsersQueryPayload,
) {
  return buildPaginatedListResponse({
    items: output.items,
    totalCount: output.total,
    page: payload.page,
    limit: payload.limit,
  });
}

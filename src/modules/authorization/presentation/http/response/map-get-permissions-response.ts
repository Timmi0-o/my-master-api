import { buildPaginatedListResponse } from 'src/modules/shared/presentation/http/response/build-paginated-list-response';
import type { IGetPermissionsApplicationOutput } from 'src/modules/authorization/application/dtos/permission/get-permissions.output';

export type IGetPermissionsHttpResponse = ReturnType<
  typeof mapGetPermissionsHttpResponse
>;

export function mapGetPermissionsHttpResponse(
  output: IGetPermissionsApplicationOutput,
) {
  return buildPaginatedListResponse({
    items: output.items,
    totalCount: output.total,
    page: 1,
    limit: output.total,
  });
}

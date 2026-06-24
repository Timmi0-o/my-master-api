import { buildPaginatedListResponse } from 'src/modules/shared/presentation/http/response/build-paginated-list-response';
import type { IGetRolePermissionsApplicationOutput } from 'src/modules/authorization/application/dtos/role-permission/get-role-permissions.output';

export type IGetRolePermissionsHttpResponse = ReturnType<
  typeof mapGetRolePermissionsHttpResponse
>;

export function mapGetRolePermissionsHttpResponse(
  output: IGetRolePermissionsApplicationOutput,
) {
  return buildPaginatedListResponse({
    items: output.items,
    totalCount: output.total,
    page: 1,
    limit: output.total,
  });
}

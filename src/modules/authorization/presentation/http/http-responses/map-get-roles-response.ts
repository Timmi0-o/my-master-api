import { buildPaginatedListResponse } from 'src/modules/shared/presentation/http/http-responses/build-paginated-list-response';
import type { IGetRolesApplicationOutput } from 'src/modules/authorization/application/dtos/role/get-roles.output';

export type IGetRolesHttpResponse = ReturnType<typeof mapGetRolesHttpResponse>;

export function mapGetRolesHttpResponse(output: IGetRolesApplicationOutput) {
  return buildPaginatedListResponse({
    items: output.items,
    totalCount: output.total,
    page: 1,
    limit: output.total,
  });
}

import type { FindManyParams } from 'src/modules/shared/domain/query';
import type { IGetMetadata } from 'src/modules/shared/domain/decorators/i-get-metadata';
import { mapOrderBy } from 'src/modules/shared/presentation/http/query/map-order-by';
import { mapPaginationToSlice } from 'src/modules/shared/presentation/http/query/map-pagination-to-slice';
import type { IUserPublicEntity } from 'src/modules/users/domain/entities/user';
import type { IGetUsersQueryPayload } from '../../validation/schemas/get-users-query.types';
import { extractUserFilter } from './extract-user-filter';
import { presetToSelectOptions } from './preset-to-select-options.mapper';

export function payloadToFindManyParams(
  payload: IGetUsersQueryPayload,
  metadata: IGetMetadata,
): FindManyParams<IUserPublicEntity, Record<never, never>> {
  const filterWhere = extractUserFilter(payload.filter, metadata.isStaffUser);

  const orderField = payload.orderField ?? 'id';
  const orderDir = payload.orderDir ?? 'asc';

  return {
    where: {
      ...(metadata.isStaffUser ? {} : { deletedAt: null }),
      ...(Object.keys(filterWhere).length > 0 ? filterWhere : {}),
    },
    slice: mapPaginationToSlice({
      page: payload.page,
      limit: payload.limit,
    }),
    orderBy: mapOrderBy<IUserPublicEntity>({ [orderField]: orderDir }),
    selectOptions: presetToSelectOptions(payload.preset, metadata.isStaffUser),
    requiredIds: payload.requiredIds,
  };
}

import type { IGetMetadata } from 'src/modules/shared/domain/decorators/i-get-metadata';
import type { FindManyParams } from 'src/modules/shared/domain/query';
import { mapOrderBy } from 'src/modules/shared/presentation/http/query/map-order-by';
import { mapPaginationToSlice } from 'src/modules/shared/presentation/http/query/map-pagination-to-slice';
import type {
  IUserProfilePublicEntity,
  IUserProfileRelations,
} from 'src/modules/users/domain/entities/user-profile';
import type { IGetUserProfilesQueryPayload } from '../../validation/schemas/get-user-profiles-query.types';
import { extractUserProfileFilter } from './extract-user-profile-filter';
import { presetToSelectOptions } from './preset-to-select-options.mapper';
import { splitPresetReadOptions } from 'src/modules/shared/application/presets/common/split-preset-read-options.helper';

export function queryParamsToFindManyParams(
  queryParams: IGetUserProfilesQueryPayload,
  metadata: IGetMetadata,
): FindManyParams<IUserProfilePublicEntity, IUserProfileRelations> {
  const filterWhere = extractUserProfileFilter(
    queryParams.filter,
    metadata.isStaffUser,
  );

  const orderField = queryParams.orderField ?? 'id';
  const orderDir = queryParams.orderDir ?? 'desc';

  return {
    where: {
      ...(metadata.isStaffUser ? {} : { deletedAt: { isNull: true } }),
      ...(filterWhere ?? {}),
    },
    slice: mapPaginationToSlice({
      page: queryParams.page,
      limit: queryParams.limit,
    }),
    orderBy: mapOrderBy<IUserProfilePublicEntity>({ [orderField]: orderDir }),
    ...splitPresetReadOptions(presetToSelectOptions(queryParams.preset, metadata.isStaffUser)),
    requiredIds: queryParams.requiredIds,
  };
}

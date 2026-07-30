import type { FindManyParams } from 'src/modules/shared/domain/query';
import type { IGetMetadata } from 'src/modules/shared/domain/decorators/i-get-metadata';
import { mapOrderBy } from 'src/modules/shared/presentation/http/query/map-order-by';
import { mapPaginationToSlice } from 'src/modules/shared/presentation/http/query/map-pagination-to-slice';
import type {
  IMasterProfilePublicEntity,
  IMasterProfileRelations,
} from 'src/modules/masters/domain/entities/master-profile';
import type { IGetMasterProfilesQueryPayload } from '../../validation/schemas/get-master-profiles-query.types';
import { extractMasterProfileFilter } from './extract-master-profile-filter';
import { presetToSelectOptions } from './preset-to-select-options.mapper';
import { splitPresetReadOptions } from 'src/modules/shared/application/presets/common/split-preset-read-options.helper';

export function requestQueryParamsToFindManyParams(
  queryParams: IGetMasterProfilesQueryPayload,
  metadata: IGetMetadata,
): FindManyParams<IMasterProfilePublicEntity, IMasterProfileRelations> {
  const filterWhere = extractMasterProfileFilter(
    queryParams.filter,
    metadata.isStaffUser,
  );

  const orderField = queryParams.orderField ?? 'id';
  const orderDir = queryParams.orderDir ?? 'asc';

  return {
    where: {
      ...(metadata.isStaffUser ? {} : { deletedAt: { isNull: true } }),
      ...(filterWhere ?? {}),
    },
    slice: mapPaginationToSlice({
      page: queryParams.page,
      limit: queryParams.limit,
    }),
    orderBy: mapOrderBy<IMasterProfilePublicEntity>({ [orderField]: orderDir }),
    ...splitPresetReadOptions(presetToSelectOptions(queryParams.preset, metadata.isStaffUser)),
    requiredIds: queryParams.requiredIds,
  };
}

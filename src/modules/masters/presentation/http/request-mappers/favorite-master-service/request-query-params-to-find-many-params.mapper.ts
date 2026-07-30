import type { FindManyParams } from 'src/modules/shared/domain/query';
import type { IGetMetadata } from 'src/modules/shared/domain/decorators/i-get-metadata';
import { mapOrderBy } from 'src/modules/shared/presentation/http/query/map-order-by';
import { mapPaginationToSlice } from 'src/modules/shared/presentation/http/query/map-pagination-to-slice';
import type {
  IFavoriteMasterServicePublicEntity,
  IFavoriteMasterServiceRelations,
} from 'src/modules/masters/domain/entities/favorite-master-service';
import type { IGetFavoriteMasterServicesQueryPayload } from '../../validation/schemas/get-favorite-master-services-query.types';
import { extractFavoriteMasterServiceFilter } from './extract-favorite-master-service-filter';
import { presetToSelectOptions } from './preset-to-select-options.mapper';
import { splitPresetReadOptions } from 'src/modules/shared/application/presets/common/split-preset-read-options.helper';

export function requestQueryParamsToFindManyParams(
  queryParams: IGetFavoriteMasterServicesQueryPayload,
  metadata: IGetMetadata,
): FindManyParams<
  IFavoriteMasterServicePublicEntity,
  IFavoriteMasterServiceRelations
> {
  const filterWhere = extractFavoriteMasterServiceFilter(
    queryParams.filter,
    metadata.isStaffUser,
  );

  const orderField = queryParams.orderField ?? 'createdAt';
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
    orderBy: mapOrderBy<IFavoriteMasterServicePublicEntity>({
      [orderField]: orderDir,
    }),
    ...splitPresetReadOptions(presetToSelectOptions(queryParams.preset, metadata.isStaffUser)),
    requiredIds: queryParams.requiredIds,
  };
}

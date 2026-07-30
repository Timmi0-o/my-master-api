import type {
  IMasterServicePublicEntity,
  IMasterServiceRelations,
} from 'src/modules/masters/domain/entities/master-service';
import type { IGetMetadata } from 'src/modules/shared/domain/decorators/i-get-metadata';
import type { FindManyParams } from 'src/modules/shared/domain/query';
import { mapOrderBy } from 'src/modules/shared/presentation/http/query/map-order-by';
import { mapPaginationToSlice } from 'src/modules/shared/presentation/http/query/map-pagination-to-slice';
import type { IGetMasterServicesQueryPayload } from '../../validation/schemas/get-master-services-query.types';
import { extractMasterServiceFilter } from './extract-master-service-filter';
import { presetToSelectOptions } from './preset-to-select-options.mapper';
import { splitPresetReadOptions } from 'src/modules/shared/application/presets/common/split-preset-read-options.helper';

export function queryParamsToFindManyParams(
  queryParams: IGetMasterServicesQueryPayload,
  metadata: IGetMetadata,
): FindManyParams<IMasterServicePublicEntity, IMasterServiceRelations> {
  const filterWhere = extractMasterServiceFilter(
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
    orderBy: mapOrderBy<IMasterServicePublicEntity>({ [orderField]: orderDir }),
    ...splitPresetReadOptions(presetToSelectOptions(queryParams.preset, metadata.isStaffUser)),
    requiredIds: queryParams.requiredIds,
  };
}

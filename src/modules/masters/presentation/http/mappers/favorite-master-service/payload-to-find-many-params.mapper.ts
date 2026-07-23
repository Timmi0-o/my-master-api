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

export function payloadToFindManyParams(
  payload: IGetFavoriteMasterServicesQueryPayload,
  metadata: IGetMetadata,
): FindManyParams<
  IFavoriteMasterServicePublicEntity,
  IFavoriteMasterServiceRelations
> {
  const filterWhere = extractFavoriteMasterServiceFilter(
    payload.filter,
    metadata.isStaffUser,
  );

  const orderField = payload.orderField ?? 'createdAt';
  const orderDir = payload.orderDir ?? 'desc';

  return {
    where: {
      ...(metadata.isStaffUser ? {} : { deletedAt: { isNull: true } }),
      ...(filterWhere ?? {}),
    },
    slice: mapPaginationToSlice({
      page: payload.page,
      limit: payload.limit,
    }),
    orderBy: mapOrderBy<IFavoriteMasterServicePublicEntity>({
      [orderField]: orderDir,
    }),
    selectOptions: presetToSelectOptions(payload.preset, metadata.isStaffUser),
    requiredIds: payload.requiredIds,
  };
}

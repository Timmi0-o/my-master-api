import type { FindManyParams } from 'src/modules/shared/domain/query';
import type { IGetMetadata } from 'src/modules/shared/domain/decorators/i-get-metadata';
import { mapOrderBy } from 'src/modules/shared/presentation/http/query/map-order-by';
import { mapPaginationToSlice } from 'src/modules/shared/presentation/http/query/map-pagination-to-slice';
import type {
  IMasterServicePublicEntity,
  IMasterServiceRelations,
} from 'src/modules/masters/domain/entities/master-service';
import type { IGetMasterServicesQueryPayload } from '../../validation/schemas/get-master-services-query.types';
import { extractMasterServiceFilter } from './extract-master-service-filter';
import { masterServicePresetToSelectOptions } from './preset-to-select-options.mapper';

export function payloadToFindManyParams(
  payload: IGetMasterServicesQueryPayload,
  metadata: IGetMetadata,
): FindManyParams<IMasterServicePublicEntity, IMasterServiceRelations> {
  const filterWhere = extractMasterServiceFilter(
    payload.filter,
    metadata.isStaffUser,
  );

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
    orderBy: mapOrderBy<IMasterServicePublicEntity>({ [orderField]: orderDir }),
    selectOptions: masterServicePresetToSelectOptions(
      payload.preset,
      metadata.isStaffUser,
    ),
    requiredIds: payload.requiredIds,
  };
}

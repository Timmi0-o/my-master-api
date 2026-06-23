import type {
  IMasterServicePublicEntity,
  IMasterServiceRelations,
} from 'src/modules/masters/domain/entities/master-service';
import type { IGetMetadata } from 'src/modules/shared/domain/decorators/i-get-metadata';
import type { FindManyParams } from 'src/modules/shared/domain/query';
import { mapOrderBy } from 'src/modules/shared/presentation/http/query/map-order-by';
import { mapPaginationToSlice } from 'src/modules/shared/presentation/http/query/map-pagination-to-slice';
import type { IGetMyServicesQueryPayload } from '../../validation/schemas/get-my-services-query.types';
import { extractMyMasterServiceFilter } from './extract-my-master-service-filter';
import { presetToSelectOptions } from './preset-to-select-options.mapper';

export function payloadToFindMyServicesParams(
  payload: IGetMyServicesQueryPayload,
  metadata: IGetMetadata,
): FindManyParams<IMasterServicePublicEntity, IMasterServiceRelations> {
  const filterWhere = extractMyMasterServiceFilter(
    payload.filter,
    metadata.isStaffUser,
  );

  const orderField = payload.orderField ?? 'id';
  const orderDir = payload.orderDir ?? 'asc';

  return {
    where: {
      ...(metadata.isStaffUser ? {} : { deletedAt: { isNull: true } }),
      ...(filterWhere ?? {}),
    },
    slice: mapPaginationToSlice({
      page: payload.page,
      limit: payload.limit,
    }),
    orderBy: mapOrderBy<IMasterServicePublicEntity>({ [orderField]: orderDir }),
    selectOptions: presetToSelectOptions(payload.preset, metadata.isStaffUser),
    requiredIds: payload.requiredIds,
  };
}

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
import { masterProfilePresetToSelectOptions } from './preset-to-select-options.mapper';

export function payloadToFindManyParams(
  payload: IGetMasterProfilesQueryPayload,
  metadata: IGetMetadata,
): FindManyParams<IMasterProfilePublicEntity, IMasterProfileRelations> {
  const filterWhere = extractMasterProfileFilter(
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
    orderBy: mapOrderBy<IMasterProfilePublicEntity>({ [orderField]: orderDir }),
    selectOptions: masterProfilePresetToSelectOptions(
      payload.preset,
      metadata.isStaffUser,
    ),
    requiredIds: payload.requiredIds,
  };
}

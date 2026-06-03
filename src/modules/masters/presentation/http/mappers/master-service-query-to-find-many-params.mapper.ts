import type { FindManyParams } from 'src/modules/shared/domain/query';
import type { IGetMetadata } from 'src/modules/shared/domain/decorators/i-get-metadata';
import { mapOrderBy } from 'src/modules/shared/presentation/http/query/map-order-by';
import { mapPaginationToSlice } from 'src/modules/shared/presentation/http/query/map-pagination-to-slice';
import { MasterServiceFilterExtractor } from 'src/modules/masters/application/presets/master-service.filter-extractor';
import type { IMasterServiceFiltersPreset } from 'src/modules/masters/application/presets/master-service-filters-preset.types';
import type { IMasterServicePublicEntity } from 'src/modules/masters/domain/entities/master-service';
import type { IGetMasterServicesQueryPayload } from '../validation/schemas/get-master-services-query.types';
import { masterServicePresetToSelectOptions } from './master-service-preset-to-select-options.mapper';

function sanitizeFilterForStaff(
  filter: IMasterServiceFiltersPreset | undefined,
  isStaffUser: boolean,
): IMasterServiceFiltersPreset | undefined {
  if (!filter || isStaffUser) return filter;

  if (filter.deletedAt === undefined) return filter;
  const next: IMasterServiceFiltersPreset = { ...filter };
  delete next.deletedAt;
  return Object.keys(next).length > 0 ? next : undefined;
}

function mergeWhereParts(
  parts: Record<string, unknown>[],
): Record<string, unknown> {
  const nonEmpty = parts.filter((p) => Object.keys(p).length > 0);

  if (nonEmpty.length === 0) return {};
  if (nonEmpty.length === 1) return nonEmpty[0];
  return { AND: nonEmpty };
}

export function masterServiceQueryToFindManyParams(
  payload: IGetMasterServicesQueryPayload,
  metadata: IGetMetadata,
): FindManyParams<IMasterServicePublicEntity, Record<never, never>> {
  const sanitizedFilter = sanitizeFilterForStaff(
    payload.filter,
    metadata.isStaffUser,
  );

  const filterWhere = MasterServiceFilterExtractor.extract(sanitizedFilter);

  const visibilityWhere = metadata.isStaffUser
    ? {}
    : { deletedAt: null };

  const orderField = payload.orderField ?? 'id';
  const orderDir = payload.orderDir ?? 'asc';

  return {
    where: mergeWhereParts([filterWhere, visibilityWhere]),
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

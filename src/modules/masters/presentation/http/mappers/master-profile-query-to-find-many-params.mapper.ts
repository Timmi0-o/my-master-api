import type { FindManyParams } from 'src/modules/shared/domain/query';
import type { IGetMetadata } from 'src/modules/shared/domain/decorators/i-get-metadata';
import { mapOrderBy } from 'src/modules/shared/presentation/http/query/map-order-by';
import { mapPaginationToSlice } from 'src/modules/shared/presentation/http/query/map-pagination-to-slice';
import { MasterProfileFilterExtractor } from 'src/modules/masters/application/presets/master-profile.filter-extractor';
import type { IMasterProfileFiltersPreset } from 'src/modules/masters/application/presets/master-profile-filters-preset.types';
import type { IMasterProfilePublicEntity } from 'src/modules/masters/domain/entities/master-profile';
import type { IGetMasterProfilesQueryPayload } from '../validation/schemas/get-master-profiles-query.types';
import { masterProfilePresetToSelectOptions } from './master-profile-preset-to-select-options.mapper';

function sanitizeFilterForStaff(
  filter: IMasterProfileFiltersPreset | undefined,
  isStaffUser: boolean,
): IMasterProfileFiltersPreset | undefined {
  if (!filter || isStaffUser) return filter;

  if (filter.deletedAt === undefined) return filter;
  const next: IMasterProfileFiltersPreset = { ...filter };
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

export function masterProfileQueryToFindManyParams(
  payload: IGetMasterProfilesQueryPayload,
  metadata: IGetMetadata,
): FindManyParams<IMasterProfilePublicEntity, Record<never, never>> {
  const sanitizedFilter = sanitizeFilterForStaff(
    payload.filter,
    metadata.isStaffUser,
  );

  const filterWhere = MasterProfileFilterExtractor.extract(sanitizedFilter);

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
    orderBy: mapOrderBy<IMasterProfilePublicEntity>({ [orderField]: orderDir }),
    selectOptions: masterProfilePresetToSelectOptions(
      payload.preset,
      metadata.isStaffUser,
    ),
    requiredIds: payload.requiredIds,
  };
}

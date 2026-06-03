import type { FindManyParams } from 'src/modules/shared/domain/query';
import type { IGetMetadata } from 'src/modules/shared/domain/decorators/i-get-metadata';
import { mapOrderBy } from 'src/modules/shared/presentation/http/query/map-order-by';
import { mapPaginationToSlice } from 'src/modules/shared/presentation/http/query/map-pagination-to-slice';
import { UserFilterExtractor } from 'src/modules/users/application/presets/user.filter-extractor';
import type { IUserFiltersPreset } from 'src/modules/users/application/presets/user-filters-preset.types';
import type { IUserPublicEntity } from 'src/modules/users/domain/entities/user';
import type { IGetUsersQueryPayload } from '../validation/schemas/get-users-query.types';
import { presetToSelectOptions } from './preset-to-select-options.mapper';

function sanitizeFilterForStaff(
  filter: IUserFiltersPreset | undefined,
  isStaffUser: boolean,
): IUserFiltersPreset | undefined {
  if (!filter || isStaffUser) return filter;

  if (filter.deletedAt === undefined) return filter;
  const next: IUserFiltersPreset = { ...filter };
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

export function queryToFindManyParams(
  payload: IGetUsersQueryPayload,
  metadata: IGetMetadata,
): FindManyParams<IUserPublicEntity, Record<never, never>> {
  const sanitizedFilter = sanitizeFilterForStaff(
    payload.filter,
    metadata.isStaffUser,
  );

  const filterWhere = UserFilterExtractor.extract(sanitizedFilter);

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
    orderBy: mapOrderBy<IUserPublicEntity>({ [orderField]: orderDir }),
    selectOptions: presetToSelectOptions(payload.preset, metadata.isStaffUser),
    requiredIds: payload.requiredIds,
  };
}

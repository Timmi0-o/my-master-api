import type {
  IMasterProfilePublicEntity,
  IMasterProfileRelations,
} from 'src/modules/masters/domain/entities/master-profile';
import type { WhereFilter } from 'src/modules/shared/domain/query';
import {
  mapMultiDateRangeFilter,
  mapMultiNumberRangeFilter,
  mapSearchByFields,
  mapStringArrayFilter,
} from 'src/modules/shared/presentation/http/mappers/filter';
import { stripDeletedAtFilterForNonStaff } from 'src/modules/shared/presentation/http/mappers/shared/staff-visibility.helper';
import type { IMasterProfileFiltersPreset } from '../../validation/types/master-profile-filters-preset.types';

export function extractMasterProfileFilter(
  filter: IMasterProfileFiltersPreset | undefined,
  isStaffUser: boolean,
): WhereFilter<IMasterProfilePublicEntity, IMasterProfileRelations> | undefined {
  const sanitized = stripDeletedAtFilterForNonStaff(filter, isStaffUser);

  if (!sanitized) {
    return undefined;
  }

  const parts: WhereFilter<
    IMasterProfilePublicEntity,
    IMasterProfileRelations
  >[] = [];

  if (sanitized.search?.value) {
    const part = mapSearchByFields<IMasterProfilePublicEntity>(
      sanitized.search.value,
      ['displayName', 'description'],
      sanitized.search.mode ?? 'PARTIAL',
    );
    if (part) parts.push(part);
  }

  const pushString = (
    field: keyof IMasterProfilePublicEntity & string,
    value: IMasterProfileFiltersPreset['id'],
  ): void => {
    if (!value) return;
    const part = mapStringArrayFilter<IMasterProfilePublicEntity>(field, value);
    if (part) parts.push(part);
  };

  pushString('id', sanitized.id);
  pushString('userId', sanitized.userId);
  pushString('displayName', sanitized.displayName);

  if (sanitized.rating) {
    const part = mapMultiNumberRangeFilter<IMasterProfilePublicEntity>(
      'rating',
      sanitized.rating,
    );
    if (part) parts.push(part);
  }

  const pushDate = (
    field: keyof IMasterProfilePublicEntity & string,
    value: IMasterProfileFiltersPreset['createdAt'],
  ): void => {
    if (!value) return;
    const part = mapMultiDateRangeFilter<IMasterProfilePublicEntity>(field, value);
    if (part) parts.push(part);
  };

  pushDate('createdAt', sanitized.createdAt);
  pushDate('updatedAt', sanitized.updatedAt);
  pushDate('deletedAt', sanitized.deletedAt);

  if (!parts.length) {
    return undefined;
  }

  if (parts.length === 1) {
    return parts[0];
  }

  return { and: parts };
}

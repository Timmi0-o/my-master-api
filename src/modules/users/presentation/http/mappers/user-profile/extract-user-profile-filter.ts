import type { IUserProfilePublicEntity } from 'src/modules/users/domain/entities/user-profile';
import type { WhereFilter } from 'src/modules/shared/domain/query';
import {
  mapMultiDateRangeFilter,
  mapMultiNumberRangeFilter,
  mapSearchByFields,
  mapStringArrayFilter,
} from 'src/modules/shared/presentation/http/mappers/filter';
import { stripDeletedAtFilterForNonStaff } from 'src/modules/shared/presentation/http/mappers/shared/staff-visibility.helper';
import type { IUserProfileFiltersPreset } from '../../validation/types/user-profile-filters-preset.types';

export function extractUserProfileFilter(
  filter: IUserProfileFiltersPreset | undefined,
  isStaffUser: boolean,
): WhereFilter<IUserProfilePublicEntity, Record<never, never>> | undefined {
  const sanitized = stripDeletedAtFilterForNonStaff(filter, isStaffUser);

  if (!sanitized) {
    return undefined;
  }

  const parts: WhereFilter<IUserProfilePublicEntity, Record<never, never>>[] =
    [];

  if (sanitized.search?.value) {
    const part = mapSearchByFields<IUserProfilePublicEntity>(
      sanitized.search.value,
      ['displayName'],
      sanitized.search.mode ?? 'PARTIAL',
    );
    if (part) parts.push(part);
  }

  const pushString = (
    field: keyof IUserProfilePublicEntity & string,
    value: IUserProfileFiltersPreset['id'],
  ): void => {
    if (!value) return;
    const part = mapStringArrayFilter<IUserProfilePublicEntity>(field, value);
    if (part) parts.push(part);
  };

  pushString('id', sanitized.id);
  pushString('userId', sanitized.userId);
  pushString('displayName', sanitized.displayName);

  if (sanitized.rating) {
    const part = mapMultiNumberRangeFilter<IUserProfilePublicEntity>(
      'rating',
      sanitized.rating,
    );
    if (part) parts.push(part);
  }

  const pushDate = (
    field: keyof IUserProfilePublicEntity & string,
    value: IUserProfileFiltersPreset['createdAt'],
  ): void => {
    if (!value) return;
    const part = mapMultiDateRangeFilter<IUserProfilePublicEntity>(field, value);
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

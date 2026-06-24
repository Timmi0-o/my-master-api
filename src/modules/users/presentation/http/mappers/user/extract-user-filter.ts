import type { WhereFilter } from 'src/modules/shared/domain/query';
import {
  mapMultiDateRangeFilter,
  mapSearchByFields,
  mapStringArrayFilter,
} from 'src/modules/shared/presentation/http/mappers/filter';
import { stripDeletedAtFilterForNonStaff } from 'src/modules/shared/presentation/http/mappers/shared/staff-visibility.helper';
import type { IUserPublicEntity } from 'src/modules/users/domain/entities/user';
import type { IUserFiltersPreset } from '../../validation/types/user-filters-preset.types';

export function extractUserFilter(
  filter: IUserFiltersPreset | undefined,
  isStaffUser: boolean,
): WhereFilter<IUserPublicEntity> | undefined {
  const sanitized = stripDeletedAtFilterForNonStaff(filter, isStaffUser);

  if (!sanitized) {
    return undefined;
  }

  const parts: WhereFilter<IUserPublicEntity>[] = [];

  if (sanitized.search?.value) {
    const part = mapSearchByFields<IUserPublicEntity>(
      sanitized.search.value,
      ['email', 'username'],
      sanitized.search.mode ?? 'PARTIAL',
    );
    if (part) parts.push(part);
  }

  const pushString = (
    field: keyof IUserPublicEntity,
    value: IUserFiltersPreset['id'],
  ): void => {
    if (!value) return;
    const part = mapStringArrayFilter<IUserPublicEntity>(field, value);
    if (part) parts.push(part);
  };

  pushString('id', sanitized.id);
  pushString('email', sanitized.email);
  pushString('username', sanitized.username);
  pushString('roleId', sanitized.roleId);
  pushString('status', sanitized.status);
  pushString('language', sanitized.language);

  const pushDate = (
    field: keyof IUserPublicEntity,
    value: IUserFiltersPreset['createdAt'],
  ): void => {
    if (!value) return;
    const part = mapMultiDateRangeFilter<IUserPublicEntity>(field, value);
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

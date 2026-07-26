import type {
  IUserBlockPublicEntity,
  IUserBlockRelations,
} from 'src/modules/users/domain/entities/user-block';
import type { WhereFilter } from 'src/modules/shared/domain/query';
import {
  mapMultiDateRangeFilter,
  mapStringArrayFilter,
} from 'src/modules/shared/presentation/http/mappers/filter';
import { stripDeletedAtFilterForNonStaff } from 'src/modules/shared/presentation/http/mappers/shared/staff-visibility.helper';
import type { IUserBlockFiltersPreset } from '../../validation/types/user-block-filters-preset.types';

export function extractUserBlockFilter(
  filter: IUserBlockFiltersPreset | undefined,
  isStaffUser: boolean,
):
  | WhereFilter<IUserBlockPublicEntity, IUserBlockRelations>
  | undefined {
  const sanitized = stripDeletedAtFilterForNonStaff(filter, isStaffUser);

  if (!sanitized) {
    return undefined;
  }

  const parts: WhereFilter<IUserBlockPublicEntity, IUserBlockRelations>[] = [];

  const pushString = (
    field: keyof IUserBlockPublicEntity & string,
    value: IUserBlockFiltersPreset['id'],
  ): void => {
    if (!value) return;
    const part = mapStringArrayFilter<IUserBlockPublicEntity>(field, value);
    if (part) parts.push(part);
  };

  pushString('id', sanitized.id);
  pushString('blockerUserId', sanitized.blockerUserId);
  pushString('blockedUserId', sanitized.blockedUserId);

  const pushDate = (
    field: keyof IUserBlockPublicEntity & string,
    value: IUserBlockFiltersPreset['createdAt'],
  ): void => {
    if (!value) return;
    const part = mapMultiDateRangeFilter<IUserBlockPublicEntity>(field, value);
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

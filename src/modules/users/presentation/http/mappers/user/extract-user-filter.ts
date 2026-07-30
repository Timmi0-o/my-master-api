import type { WhereFilter } from 'src/modules/shared/domain/query';
import {
  finalizeWhereFilterParts,
  queryFilterBuildManager,
} from 'src/modules/shared/presentation/http/mappers/filter';
import { stripStaffOnlyFilterFieldsForNonStaff } from 'src/modules/shared/presentation/http/mappers/shared/staff-visibility.helper';
import { USER_STAFF_ONLY_FIELDS } from 'src/modules/users/domain/entities/user/user-select-fields';
import type { IUserPublicEntity } from 'src/modules/users/domain/entities/user';
import type { IUserFiltersPreset } from '../../validation/types/user-filters-preset.types';

export function extractUserFilter(
  filter: IUserFiltersPreset | undefined,
  isStaffUser: boolean,
): WhereFilter<IUserPublicEntity> | undefined {
  const sanitized = stripStaffOnlyFilterFieldsForNonStaff(filter, isStaffUser, USER_STAFF_ONLY_FIELDS);
  if (!sanitized) return undefined;

  const parts: WhereFilter<IUserPublicEntity>[] = [];

  queryFilterBuildManager(parts, [
    {
      type: 'search',
      value: sanitized.search?.value,
      fieldsBySearch: ['email', 'username'],
      mode: sanitized.search?.mode,
    },
    { type: 'stringArray', field: 'id', value: sanitized.id },
    { type: 'stringArray', field: 'email', value: sanitized.email },
    { type: 'stringArray', field: 'username', value: sanitized.username },
    { type: 'stringArray', field: 'roleId', value: sanitized.roleId },
    { type: 'stringArray', field: 'status', value: sanitized.status },
    { type: 'stringArray', field: 'language', value: sanitized.language },
    { type: 'dateRange', field: 'createdAt', value: sanitized.createdAt },
    { type: 'dateRange', field: 'updatedAt', value: sanitized.updatedAt },
    { type: 'dateRange', field: 'deletedAt', value: sanitized.deletedAt },
  ]);

  return finalizeWhereFilterParts(parts);
}

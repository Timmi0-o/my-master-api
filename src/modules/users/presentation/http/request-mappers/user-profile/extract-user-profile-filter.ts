import type {
  IUserProfilePublicEntity,
  IUserProfileRelations,
} from 'src/modules/users/domain/entities/user-profile';
import type { WhereFilter } from 'src/modules/shared/domain/query';
import {
  finalizeWhereFilterParts,
  queryFilterBuildManager,
} from 'src/modules/shared/presentation/http/request-mappers/filter';
import { stripStaffOnlyFilterFieldsForNonStaff } from 'src/modules/shared/presentation/http/request-mappers/shared/staff-visibility.helper';
import { USER_PROFILE_STAFF_ONLY_FIELDS } from 'src/modules/users/domain/entities/user-profile/user-profile--select-fields';
import type { IUserProfileFiltersPreset } from '../../validation/types/user-profile-filters-preset.types';

export function extractUserProfileFilter(
  filter: IUserProfileFiltersPreset | undefined,
  isStaffUser: boolean,
): WhereFilter<IUserProfilePublicEntity, IUserProfileRelations> | undefined {
  const sanitized = stripStaffOnlyFilterFieldsForNonStaff(filter, isStaffUser, USER_PROFILE_STAFF_ONLY_FIELDS);
  if (!sanitized) return undefined;

  const parts: WhereFilter<IUserProfilePublicEntity, IUserProfileRelations>[] =
    [];

  queryFilterBuildManager(parts, [
    {
      type: 'search',
      value: sanitized.search?.value,
      fieldsBySearch: ['displayName'],
      mode: sanitized.search?.mode,
    },
    { type: 'stringArray', field: 'id', value: sanitized.id },
    { type: 'stringArray', field: 'userId', value: sanitized.userId },
    {
      type: 'stringArray',
      field: 'displayName',
      value: sanitized.displayName,
    },
    { type: 'numberRange', field: 'rating', value: sanitized.rating },
    { type: 'dateRange', field: 'createdAt', value: sanitized.createdAt },
    { type: 'dateRange', field: 'updatedAt', value: sanitized.updatedAt },
    { type: 'dateRange', field: 'deletedAt', value: sanitized.deletedAt },
  ]);

  return finalizeWhereFilterParts(parts);
}

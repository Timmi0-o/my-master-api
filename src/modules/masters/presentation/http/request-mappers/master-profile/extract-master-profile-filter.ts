import type {
  IMasterProfilePublicEntity,
  IMasterProfileRelations,
} from 'src/modules/masters/domain/entities/master-profile';
import type { WhereFilter } from 'src/modules/shared/domain/query';
import {
  finalizeWhereFilterParts,
  queryFilterBuildManager,
} from 'src/modules/shared/presentation/http/request-mappers/filter';
import { stripStaffOnlyFilterFieldsForNonStaff } from 'src/modules/shared/presentation/http/request-mappers/shared/staff-visibility.helper';
import { MASTER_PROFILE_STAFF_ONLY_FIELDS } from 'src/modules/masters/domain/entities/master-profile/master-profile-select-fields';
import type { IMasterProfileFiltersPreset } from '../../validation/types/master-profile-filters-preset.types';

export function extractMasterProfileFilter(
  filter: IMasterProfileFiltersPreset | undefined,
  isStaffUser: boolean,
):
  | WhereFilter<IMasterProfilePublicEntity, IMasterProfileRelations>
  | undefined {
  const sanitized = stripStaffOnlyFilterFieldsForNonStaff(filter, isStaffUser, MASTER_PROFILE_STAFF_ONLY_FIELDS);
  if (!sanitized) return undefined;

  const parts: WhereFilter<
    IMasterProfilePublicEntity,
    IMasterProfileRelations
  >[] = [];

  queryFilterBuildManager(parts, [
    {
      type: 'search',
      value: sanitized.search?.value,
      fieldsBySearch: ['displayName', 'description'],
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

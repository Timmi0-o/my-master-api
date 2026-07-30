import type { WhereFilter } from 'src/modules/shared/domain/query';
import {
  finalizeWhereFilterParts,
  queryFilterBuildManager,
} from 'src/modules/shared/presentation/http/mappers/filter';
import { stripStaffOnlyFilterFieldsForNonStaff } from 'src/modules/shared/presentation/http/mappers/shared/staff-visibility.helper';
import { USER_BLOCK_STAFF_ONLY_FIELDS } from 'src/modules/users/domain/entities/user-block/user-block-select-fields';
import type {
  IUserBlockPublicEntity,
  IUserBlockRelations,
} from 'src/modules/users/domain/entities/user-block';
import type { IUserBlockFiltersPreset } from '../../validation/types/user-block-filters-preset.types';

export function extractUserBlockFilter(
  filter: IUserBlockFiltersPreset | undefined,
  isStaffUser: boolean,
): WhereFilter<IUserBlockPublicEntity, IUserBlockRelations> | undefined {
  const sanitized = stripStaffOnlyFilterFieldsForNonStaff(filter, isStaffUser, USER_BLOCK_STAFF_ONLY_FIELDS);
  if (!sanitized) return undefined;

  const parts: WhereFilter<IUserBlockPublicEntity, IUserBlockRelations>[] = [];

  queryFilterBuildManager(parts, [
    { type: 'stringArray', field: 'id', value: sanitized.id },
    {
      type: 'stringArray',
      field: 'blockerUserId',
      value: sanitized.blockerUserId,
    },
    {
      type: 'stringArray',
      field: 'blockedUserId',
      value: sanitized.blockedUserId,
    },
    { type: 'dateRange', field: 'createdAt', value: sanitized.createdAt },
    { type: 'dateRange', field: 'updatedAt', value: sanitized.updatedAt },
    { type: 'dateRange', field: 'deletedAt', value: sanitized.deletedAt },
  ]);

  return finalizeWhereFilterParts(parts);
}

import type {
  IFavoriteMasterServicePublicEntity,
  IFavoriteMasterServiceRelations,
} from 'src/modules/masters/domain/entities/favorite-master-service';
import type { WhereFilter } from 'src/modules/shared/domain/query';
import {
  finalizeWhereFilterParts,
  queryFilterBuildManager,
} from 'src/modules/shared/presentation/http/mappers/filter';
import { stripStaffOnlyFilterFieldsForNonStaff } from 'src/modules/shared/presentation/http/mappers/shared/staff-visibility.helper';
import { FAVORITE_MASTER_SERVICE_STAFF_ONLY_FIELDS } from 'src/modules/masters/domain/entities/favorite-master-service/favorite-master-service-select-fields';
import type { IFavoriteMasterServiceFiltersPreset } from '../../validation/types/favorite-master-service-filters-preset.types';

export function extractFavoriteMasterServiceFilter(
  filter: IFavoriteMasterServiceFiltersPreset | undefined,
  isStaffUser: boolean,
):
  | WhereFilter<
      IFavoriteMasterServicePublicEntity,
      IFavoriteMasterServiceRelations
    >
  | undefined {
  const sanitized = stripStaffOnlyFilterFieldsForNonStaff(filter, isStaffUser, FAVORITE_MASTER_SERVICE_STAFF_ONLY_FIELDS);
  if (!sanitized) return undefined;

  const parts: WhereFilter<
    IFavoriteMasterServicePublicEntity,
    IFavoriteMasterServiceRelations
  >[] = [];

  queryFilterBuildManager(parts, [
    { type: 'stringArray', field: 'id', value: sanitized.id },
    { type: 'stringArray', field: 'userId', value: sanitized.userId },
    {
      type: 'stringArray',
      field: 'masterServiceId',
      value: sanitized.masterServiceId,
    },
    { type: 'dateRange', field: 'createdAt', value: sanitized.createdAt },
    { type: 'dateRange', field: 'updatedAt', value: sanitized.updatedAt },
    { type: 'dateRange', field: 'deletedAt', value: sanitized.deletedAt },
  ]);

  return finalizeWhereFilterParts(parts);
}

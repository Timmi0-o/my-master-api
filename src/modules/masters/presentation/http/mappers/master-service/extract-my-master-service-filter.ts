import type {
  IMasterServicePublicEntity,
  IMasterServiceRelations,
} from 'src/modules/masters/domain/entities/master-service';
import type { WhereFilter } from 'src/modules/shared/domain/query';
import {
  finalizeWhereFilterParts,
  queryFilterBuildManager,
} from 'src/modules/shared/presentation/http/mappers/filter';
import { stripStaffOnlyFilterFieldsForNonStaff } from 'src/modules/shared/presentation/http/mappers/shared/staff-visibility.helper';
import { MASTER_SERVICE_STAFF_ONLY_FIELDS } from 'src/modules/masters/domain/entities/master-service/master-service-select-fields';
import type { IMyMasterServiceFiltersPreset } from '../../validation/types/my-master-service-filters-preset.types';

export function extractMyMasterServiceFilter(
  filter: IMyMasterServiceFiltersPreset | undefined,
  isStaffUser: boolean,
): WhereFilter<IMasterServicePublicEntity, IMasterServiceRelations> | undefined {
  const sanitized = stripStaffOnlyFilterFieldsForNonStaff(filter, isStaffUser, MASTER_SERVICE_STAFF_ONLY_FIELDS);
  if (!sanitized) return undefined;

  const parts: WhereFilter<IMasterServicePublicEntity, IMasterServiceRelations>[] =
    [];

  queryFilterBuildManager(parts, [
    {
      type: 'search',
      value: sanitized.search?.value,
      fieldsBySearch: ['name', 'description'],
      mode: sanitized.search?.mode,
    },
    { type: 'stringArray', field: 'id', value: sanitized.id },
    { type: 'stringArray', field: 'name', value: sanitized.name },
    { type: 'numberRange', field: 'price', value: sanitized.price },
    { type: 'dateRange', field: 'createdAt', value: sanitized.createdAt },
    { type: 'dateRange', field: 'updatedAt', value: sanitized.updatedAt },
    { type: 'dateRange', field: 'deletedAt', value: sanitized.deletedAt },
  ]);

  return finalizeWhereFilterParts(parts);
}

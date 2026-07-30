import type {
  IMasterScheduleExceptionPublicEntity,
  IMasterScheduleExceptionRelations,
} from 'src/modules/masters/domain/entities/master-schedule-exception';
import type { WhereFilter } from 'src/modules/shared/domain/query';
import {
  finalizeWhereFilterParts,
  queryFilterBuildManager,
} from 'src/modules/shared/presentation/http/mappers/filter';
import { stripStaffOnlyFilterFieldsForNonStaff } from 'src/modules/shared/presentation/http/mappers/shared/staff-visibility.helper';
import { MASTER_SCHEDULE_EXCEPTION_STAFF_ONLY_FIELDS } from 'src/modules/masters/domain/entities/master-schedule-exception/master-schedule-exception-select-fields';
import type { IMasterScheduleExceptionFiltersPreset } from '../../validation/types/master-schedule-exception-filters-preset.types';

export function extractMasterScheduleExceptionFilter(
  filter: IMasterScheduleExceptionFiltersPreset | undefined,
  isStaffUser: boolean,
): WhereFilter<
  IMasterScheduleExceptionPublicEntity,
  IMasterScheduleExceptionRelations
> | undefined {
  const sanitized = stripStaffOnlyFilterFieldsForNonStaff(filter, isStaffUser, MASTER_SCHEDULE_EXCEPTION_STAFF_ONLY_FIELDS);
  if (!sanitized) return undefined;

  const parts: WhereFilter<
    IMasterScheduleExceptionPublicEntity,
    IMasterScheduleExceptionRelations
  >[] = [];

  queryFilterBuildManager(parts, [
    {
      type: 'search',
      value: sanitized.search?.value,
      fieldsBySearch: ['title', 'note'],
      mode: sanitized.search?.mode,
    },
    { type: 'stringArray', field: 'id', value: sanitized.id },
    {
      type: 'stringArray',
      field: 'masterProfileId',
      value: sanitized.masterProfileId,
    },
    {
      type: 'stringArray',
      field: 'kind',
      value: sanitized.kind as IMasterScheduleExceptionFiltersPreset['id'],
    },
    { type: 'dateRange', field: 'startsAt', value: sanitized.startsAt },
    { type: 'dateRange', field: 'endsAt', value: sanitized.endsAt },
    { type: 'dateRange', field: 'createdAt', value: sanitized.createdAt },
    { type: 'dateRange', field: 'updatedAt', value: sanitized.updatedAt },
    { type: 'dateRange', field: 'deletedAt', value: sanitized.deletedAt },
  ]);

  return finalizeWhereFilterParts(parts);
}

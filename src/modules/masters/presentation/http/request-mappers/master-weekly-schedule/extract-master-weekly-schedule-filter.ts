import type {
  IMasterWeeklySchedulePublicEntity,
  IMasterWeeklyScheduleRelations,
} from 'src/modules/masters/domain/entities/master-weekly-schedule';
import type { WhereFilter } from 'src/modules/shared/domain/query';
import {
  finalizeWhereFilterParts,
  queryFilterBuildManager,
} from 'src/modules/shared/presentation/http/request-mappers/filter';
import { stripStaffOnlyFilterFieldsForNonStaff } from 'src/modules/shared/presentation/http/request-mappers/shared/staff-visibility.helper';
import { MASTER_WEEKLY_SCHEDULE_STAFF_ONLY_FIELDS } from 'src/modules/masters/domain/entities/master-weekly-schedule/master-weekly-schedule-select-fields';
import type { IMasterWeeklyScheduleFiltersPreset } from '../../validation/types/master-weekly-schedule-filters-preset.types';

export function extractMasterWeeklyScheduleFilter(
  filter: IMasterWeeklyScheduleFiltersPreset | undefined,
  isStaffUser: boolean,
):
  | WhereFilter<
      IMasterWeeklySchedulePublicEntity,
      IMasterWeeklyScheduleRelations
    >
  | undefined {
  const sanitized = stripStaffOnlyFilterFieldsForNonStaff(filter, isStaffUser, MASTER_WEEKLY_SCHEDULE_STAFF_ONLY_FIELDS);
  if (!sanitized) return undefined;

  const parts: WhereFilter<
    IMasterWeeklySchedulePublicEntity,
    IMasterWeeklyScheduleRelations
  >[] = [];

  queryFilterBuildManager(parts, [
    { type: 'stringArray', field: 'id', value: sanitized.id },
    {
      type: 'stringArray',
      field: 'masterProfileId',
      value: sanitized.masterProfileId,
    },
    {
      type: 'stringArray',
      field: 'dayOfWeek',
      value: sanitized.dayOfWeek as IMasterWeeklyScheduleFiltersPreset['id'],
    },
    { type: 'stringArray', field: 'startTime', value: sanitized.startTime },
    { type: 'stringArray', field: 'endTime', value: sanitized.endTime },
    { type: 'dateRange', field: 'createdAt', value: sanitized.createdAt },
    { type: 'dateRange', field: 'updatedAt', value: sanitized.updatedAt },
    { type: 'dateRange', field: 'deletedAt', value: sanitized.deletedAt },
  ]);

  return finalizeWhereFilterParts(parts);
}

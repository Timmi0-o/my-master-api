import type {
  IMasterWeeklySchedulePublicEntity,
  IMasterWeeklyScheduleRelations,
} from 'src/modules/masters/domain/entities/master-weekly-schedule';
import type { WhereFilter } from 'src/modules/shared/domain/query';
import {
  mapMultiDateRangeFilter,
  mapStringArrayFilter,
} from 'src/modules/shared/presentation/http/mappers/filter';
import { stripDeletedAtFilterForNonStaff } from 'src/modules/shared/presentation/http/mappers/shared/staff-visibility.helper';
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
  const sanitized = stripDeletedAtFilterForNonStaff(filter, isStaffUser);

  if (!sanitized) {
    return undefined;
  }

  const parts: WhereFilter<
    IMasterWeeklySchedulePublicEntity,
    IMasterWeeklyScheduleRelations
  >[] = [];

  const pushString = (
    field: keyof IMasterWeeklySchedulePublicEntity & string,
    value: IMasterWeeklyScheduleFiltersPreset['id'],
  ): void => {
    if (!value) return;
    const part = mapStringArrayFilter<IMasterWeeklySchedulePublicEntity>(
      field,
      value,
    );
    if (part) parts.push(part);
  };

  pushString('id', sanitized.id);
  pushString('masterProfileId', sanitized.masterProfileId);
  pushString(
    'dayOfWeek',
    sanitized.dayOfWeek as IMasterWeeklyScheduleFiltersPreset['id'],
  );
  pushString('startTime', sanitized.startTime);
  pushString('endTime', sanitized.endTime);

  const pushDate = (
    field: keyof IMasterWeeklySchedulePublicEntity & string,
    value: IMasterWeeklyScheduleFiltersPreset['createdAt'],
  ): void => {
    if (!value) return;
    const part = mapMultiDateRangeFilter<IMasterWeeklySchedulePublicEntity>(
      field,
      value,
    );
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

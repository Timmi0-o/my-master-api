import type { TPresetType } from 'src/modules/shared/application/presets/common/preset.types';
import type { IMasterWeeklyScheduleFiltersPreset } from '../types/master-weekly-schedule-filters-preset.types';

export const MASTER_WEEKLY_SCHEDULE_LIST_ORDER_FIELDS = [
  'id',
  'masterProfileId',
  'dayOfWeek',
  'startTime',
  'endTime',
  'createdAt',
  'updatedAt',
] as const;

export type TMasterWeeklyScheduleListOrderField =
  (typeof MASTER_WEEKLY_SCHEDULE_LIST_ORDER_FIELDS)[number];

export interface IGetMasterWeeklySchedulesQueryPayload {
  preset?: TPresetType;
  limit?: number;
  page?: number;
  orderField?: TMasterWeeklyScheduleListOrderField;
  orderDir?: 'asc' | 'desc';
  filter?: IMasterWeeklyScheduleFiltersPreset;
  requiredIds?: string[];
}

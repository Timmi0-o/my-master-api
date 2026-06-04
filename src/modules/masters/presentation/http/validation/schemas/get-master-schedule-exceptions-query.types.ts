import type { TPresetType } from 'src/modules/shared/application/presets/common/preset.types';
import type { IMasterScheduleExceptionFiltersPreset } from '../types/master-schedule-exception-filters-preset.types';

export const MASTER_SCHEDULE_EXCEPTION_LIST_ORDER_FIELDS = [
  'id',
  'masterProfileId',
  'startsAt',
  'endsAt',
  'kind',
  'createdAt',
  'updatedAt',
] as const;

export type TMasterScheduleExceptionListOrderField =
  (typeof MASTER_SCHEDULE_EXCEPTION_LIST_ORDER_FIELDS)[number];

export interface IGetMasterScheduleExceptionsQueryPayload {
  preset?: TPresetType;
  limit?: number;
  page?: number;
  orderField?: TMasterScheduleExceptionListOrderField;
  orderDir?: 'asc' | 'desc';
  filter?: IMasterScheduleExceptionFiltersPreset;
  requiredIds?: string[];
}

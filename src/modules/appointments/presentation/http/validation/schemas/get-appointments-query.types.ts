import type { TPresetType } from 'src/modules/shared/application/presets/common/preset.types';
import type { IAppointmentFiltersPreset } from '../types/appointment-filters-preset.types';

export const APPOINTMENT_LIST_ORDER_FIELDS = [
  'id',
  'startsAt',
  'createdAt',
  'status',
] as const;

export type TAppointmentListOrderField =
  (typeof APPOINTMENT_LIST_ORDER_FIELDS)[number];

export interface IGetAppointmentsQueryPayload {
  preset?: TPresetType;
  limit?: number;
  page?: number;
  orderField?: TAppointmentListOrderField;
  orderDir?: 'asc' | 'desc';
  filter?: IAppointmentFiltersPreset;
  requiredIds?: string[];
}

import type { IDateRangeArrayFilter, IStringArrayFilter } from 'src/modules/shared/application/presets/common/filter-preset.types';

export interface IAppointmentChatFiltersPreset {
  id?: IStringArrayFilter | null;
  appointmentId?: IStringArrayFilter | null;
  createdAt?: IDateRangeArrayFilter | null;
  updatedAt?: IDateRangeArrayFilter | null;
  deletedAt?: IDateRangeArrayFilter | null;
}

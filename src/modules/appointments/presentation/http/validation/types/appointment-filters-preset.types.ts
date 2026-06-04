import type {
  IDateRangeArrayFilter,
  IStringArrayFilter,
  ITextSearchFilterPreset,
} from 'src/modules/shared/application/presets/common/filter-preset.types';
import type { EAppointmentStatus } from 'src/modules/appointments/domain/entities/appointment/appointment.enum';

export interface IAppointmentFiltersPreset {
  search?: ITextSearchFilterPreset | null;
  id?: IStringArrayFilter | null;
  masterProfileId?: IStringArrayFilter | null;
  masterServiceId?: IStringArrayFilter | null;
  clientUserId?: IStringArrayFilter | null;
  status?: { value: EAppointmentStatus[]; mode?: 'OR' | 'AND' } | null;
  startsAt?: IDateRangeArrayFilter | null;
  createdAt?: IDateRangeArrayFilter | null;
  updatedAt?: IDateRangeArrayFilter | null;
  deletedAt?: IDateRangeArrayFilter | null;
}

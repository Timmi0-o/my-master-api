import type {
  IDateRangeArrayFilter,
  IStringArrayFilter,
  ITextSearchFilterPreset,
} from 'src/modules/shared/application/presets/common/filter-preset.types';
export interface IMasterWeeklyScheduleFiltersPreset {
  id?: IStringArrayFilter;
  masterProfileId?: IStringArrayFilter;
  dayOfWeek?: IStringArrayFilter;
  startTime?: IStringArrayFilter;
  endTime?: IStringArrayFilter;
  createdAt?: IDateRangeArrayFilter;
  updatedAt?: IDateRangeArrayFilter;
  deletedAt?: IDateRangeArrayFilter;
}

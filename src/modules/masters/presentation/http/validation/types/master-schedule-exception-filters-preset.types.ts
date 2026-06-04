import type {
  IDateRangeArrayFilter,
  IStringArrayFilter,
  ITextSearchFilterPreset,
} from 'src/modules/shared/application/presets/common/filter-preset.types';
export interface IMasterScheduleExceptionFiltersPreset {
  search?: ITextSearchFilterPreset;
  id?: IStringArrayFilter;
  masterProfileId?: IStringArrayFilter;
  kind?: IStringArrayFilter;
  startsAt?: IDateRangeArrayFilter;
  endsAt?: IDateRangeArrayFilter;
  createdAt?: IDateRangeArrayFilter;
  updatedAt?: IDateRangeArrayFilter;
  deletedAt?: IDateRangeArrayFilter;
}

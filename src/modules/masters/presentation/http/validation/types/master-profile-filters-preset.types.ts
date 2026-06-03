import type {
  IDateRangeArrayFilter,
  INumberRangeArrayFilter,
  IStringArrayFilter,
  ITextSearchFilterPreset,
} from 'src/modules/shared/application/presets/common/filter-preset.types';

export interface IMasterProfileFiltersPreset {
  search?: ITextSearchFilterPreset;
  id?: IStringArrayFilter;
  userId?: IStringArrayFilter;
  displayName?: IStringArrayFilter;
  rating?: INumberRangeArrayFilter;
  createdAt?: IDateRangeArrayFilter;
  updatedAt?: IDateRangeArrayFilter;
  deletedAt?: IDateRangeArrayFilter;
}

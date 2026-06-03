import type {
  IDateRangeArrayFilter,
  INumberRangeArrayFilter,
  IStringArrayFilter,
  ITextSearchFilterPreset,
} from 'src/modules/shared/application/presets/common/filter-preset.types';

export interface IMasterServiceFiltersPreset {
  search?: ITextSearchFilterPreset;
  id?: IStringArrayFilter;
  masterProfileId?: IStringArrayFilter;
  name?: IStringArrayFilter;
  price?: INumberRangeArrayFilter;
  createdAt?: IDateRangeArrayFilter;
  updatedAt?: IDateRangeArrayFilter;
  deletedAt?: IDateRangeArrayFilter;
}

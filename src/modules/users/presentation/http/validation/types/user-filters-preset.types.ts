import type {
  IDateRangeArrayFilter,
  IStringArrayFilter,
  ITextSearchFilterPreset,
} from 'src/modules/shared/application/presets/common/filter-preset.types';

export interface IUserFiltersPreset {
  search?: ITextSearchFilterPreset;
  id?: IStringArrayFilter;
  email?: IStringArrayFilter;
  username?: IStringArrayFilter;
  roleId?: IStringArrayFilter;
  status?: IStringArrayFilter;
  language?: IStringArrayFilter;
  createdAt?: IDateRangeArrayFilter;
  updatedAt?: IDateRangeArrayFilter;
  deletedAt?: IDateRangeArrayFilter;
}

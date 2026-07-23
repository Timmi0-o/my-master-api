import type {
  IDateRangeArrayFilter,
  IStringArrayFilter,
} from 'src/modules/shared/application/presets/common/filter-preset.types';

export interface IFavoriteMasterServiceFiltersPreset {
  id?: IStringArrayFilter;
  userId?: IStringArrayFilter;
  masterServiceId?: IStringArrayFilter;
  createdAt?: IDateRangeArrayFilter;
  updatedAt?: IDateRangeArrayFilter;
  deletedAt?: IDateRangeArrayFilter;
}

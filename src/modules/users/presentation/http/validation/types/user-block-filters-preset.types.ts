import type {
  IDateRangeArrayFilter,
  IStringArrayFilter,
} from 'src/modules/shared/application/presets/common/filter-preset.types';

export interface IUserBlockFiltersPreset {
  id?: IStringArrayFilter;
  blockerUserId?: IStringArrayFilter;
  blockedUserId?: IStringArrayFilter;
  createdAt?: IDateRangeArrayFilter;
  updatedAt?: IDateRangeArrayFilter;
  deletedAt?: IDateRangeArrayFilter;
}

import type {
  IDateRangeArrayFilter,
  IStringArrayFilter,
} from 'src/modules/shared/application/presets/common/filter-preset.types';

export interface IMasterSubscriptionFiltersPreset {
  id?: IStringArrayFilter;
  userId?: IStringArrayFilter;
  masterProfileId?: IStringArrayFilter;
  createdAt?: IDateRangeArrayFilter;
  updatedAt?: IDateRangeArrayFilter;
  deletedAt?: IDateRangeArrayFilter;
}

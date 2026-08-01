import type {
  IDateRangeArrayFilter,
  INumberRangeArrayFilter,
  IStringArrayFilter,
  ITextSearchFilterPreset,
} from 'src/modules/shared/application/presets/common/filter-preset.types';
import type { EMasterBookingStatus } from 'src/modules/masters/domain/entities/master-profile';

export interface IMasterProfileFiltersPreset {
  search?: ITextSearchFilterPreset;
  id?: IStringArrayFilter;
  userId?: IStringArrayFilter;
  displayName?: IStringArrayFilter;
  bookingStatus?: IStringArrayFilter & {
    value: EMasterBookingStatus[];
  };
  rating?: INumberRangeArrayFilter;
  createdAt?: IDateRangeArrayFilter;
  updatedAt?: IDateRangeArrayFilter;
  deletedAt?: IDateRangeArrayFilter;
}

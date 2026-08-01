import type {
  IDateRangeArrayFilter,
  INumberRangeArrayFilter,
  IStringArrayFilter,
  ITextSearchFilterPreset,
} from 'src/modules/shared/application/presets/common/filter-preset.types';
import type { EMasterBookingStatus } from 'src/modules/masters/domain/entities/master-profile';

export interface IMasterServiceFiltersPreset {
  search?: ITextSearchFilterPreset;
  id?: IStringArrayFilter;
  masterProfileId?: IStringArrayFilter;
  name?: IStringArrayFilter;
  price?: INumberRangeArrayFilter;
  masterBookingStatus?: IStringArrayFilter & {
    value: EMasterBookingStatus[];
  };
  createdAt?: IDateRangeArrayFilter;
  updatedAt?: IDateRangeArrayFilter;
  deletedAt?: IDateRangeArrayFilter;
}

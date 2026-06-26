import type {
  IDateRangeArrayFilter,
  INumberRangeArrayFilter,
  IStringArrayFilter,
} from 'src/modules/shared/application/presets/common/filter-preset.types';

export interface IMasterServiceReviewFiltersPreset {
  id?: IStringArrayFilter;
  masterServiceId?: IStringArrayFilter;
  clientUserId?: IStringArrayFilter;
  appointmentId?: IStringArrayFilter;
  rating?: INumberRangeArrayFilter;
  createdAt?: IDateRangeArrayFilter;
  updatedAt?: IDateRangeArrayFilter;
  deletedAt?: IDateRangeArrayFilter;
}

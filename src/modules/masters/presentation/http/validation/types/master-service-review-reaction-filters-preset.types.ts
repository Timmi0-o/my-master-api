import type {
  IDateRangeArrayFilter,
  IStringArrayFilter,
} from 'src/modules/shared/application/presets/common/filter-preset.types';

export interface IMasterServiceReviewReactionFiltersPreset {
  id?: IStringArrayFilter;
  userId?: IStringArrayFilter;
  masterServiceReviewId?: IStringArrayFilter;
  type?: IStringArrayFilter;
  createdAt?: IDateRangeArrayFilter;
  updatedAt?: IDateRangeArrayFilter;
  deletedAt?: IDateRangeArrayFilter;
}

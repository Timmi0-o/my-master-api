import type { TPresetType } from 'src/modules/shared/application/presets/common/preset.types';
import type { IMasterServiceReviewFiltersPreset } from '../types/master-service-review-filters-preset.types';

export const MASTER_SERVICE_REVIEW_LIST_ORDER_FIELDS = [
  'id',
  'clientUserId',
  'masterServiceId',
  'appointmentId',
  'rating',
  'createdAt',
  'updatedAt',
] as const;

export type TMasterServiceReviewListOrderField =
  (typeof MASTER_SERVICE_REVIEW_LIST_ORDER_FIELDS)[number];

export interface IGetMasterServiceReviewsQueryPayload {
  preset?: TPresetType;
  limit?: number;
  page?: number;
  orderField?: TMasterServiceReviewListOrderField;
  orderDir?: 'asc' | 'desc';
  filter?: IMasterServiceReviewFiltersPreset;
  requiredIds?: string[];
}

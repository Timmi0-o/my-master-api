import type { TPresetType } from 'src/modules/shared/application/presets/common/preset.types';
import type { IMasterServiceReviewReactionFiltersPreset } from '../types/master-service-review-reaction-filters-preset.types';

export const MASTER_SERVICE_REVIEW_REACTION_LIST_ORDER_FIELDS = [
  'id',
  'userId',
  'masterServiceReviewId',
  'type',
  'createdAt',
  'updatedAt',
] as const;

export type TMasterServiceReviewReactionListOrderField =
  (typeof MASTER_SERVICE_REVIEW_REACTION_LIST_ORDER_FIELDS)[number];

export interface IGetMasterServiceReviewReactionsQueryPayload {
  preset?: TPresetType;
  limit?: number;
  page?: number;
  orderField?: TMasterServiceReviewReactionListOrderField;
  orderDir?: 'asc' | 'desc';
  filter?: IMasterServiceReviewReactionFiltersPreset;
  requiredIds?: string[];
}

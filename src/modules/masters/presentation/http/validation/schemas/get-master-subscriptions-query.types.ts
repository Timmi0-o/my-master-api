import type { TPresetType } from 'src/modules/shared/application/presets/common/preset.types';
import type { IMasterSubscriptionFiltersPreset } from '../types/master-subscription-filters-preset.types';

export const MASTER_SUBSCRIPTION_LIST_ORDER_FIELDS = [
  'id',
  'userId',
  'masterProfileId',
  'createdAt',
  'updatedAt',
] as const;

export type TMasterSubscriptionListOrderField =
  (typeof MASTER_SUBSCRIPTION_LIST_ORDER_FIELDS)[number];

export interface IGetMasterSubscriptionsQueryPayload {
  preset?: TPresetType;
  limit?: number;
  page?: number;
  orderField?: TMasterSubscriptionListOrderField;
  orderDir?: 'asc' | 'desc';
  filter?: IMasterSubscriptionFiltersPreset;
  requiredIds?: string[];
}

import type { TPresetType } from 'src/modules/shared/application/presets/common/preset.types';
import type { IFavoriteMasterServiceFiltersPreset } from '../types/favorite-master-service-filters-preset.types';

export const FAVORITE_MASTER_SERVICE_LIST_ORDER_FIELDS = [
  'id',
  'userId',
  'masterServiceId',
  'createdAt',
  'updatedAt',
] as const;

export type TFavoriteMasterServiceListOrderField =
  (typeof FAVORITE_MASTER_SERVICE_LIST_ORDER_FIELDS)[number];

export interface IGetFavoriteMasterServicesQueryPayload {
  preset?: TPresetType;
  limit?: number;
  page?: number;
  orderField?: TFavoriteMasterServiceListOrderField;
  orderDir?: 'asc' | 'desc';
  filter?: IFavoriteMasterServiceFiltersPreset;
  requiredIds?: string[];
}

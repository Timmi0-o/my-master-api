import type { TPresetType } from 'src/modules/shared/application/presets/common/preset.types';
import type { IMyMasterServiceFiltersPreset } from '../types/my-master-service-filters-preset.types';

export const MY_MASTER_SERVICE_LIST_ORDER_FIELDS = [
  'id',
  'name',
  'price',
  'createdAt',
  'updatedAt',
] as const;

export type TMyMasterServiceListOrderField =
  (typeof MY_MASTER_SERVICE_LIST_ORDER_FIELDS)[number];

export interface IGetMyServicesQueryPayload {
  preset?: TPresetType;
  limit?: number;
  page?: number;
  orderField?: TMyMasterServiceListOrderField;
  orderDir?: 'asc' | 'desc';
  filter?: IMyMasterServiceFiltersPreset;
  requiredIds?: string[];
}

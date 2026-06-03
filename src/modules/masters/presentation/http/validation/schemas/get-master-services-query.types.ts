import type { TPresetType } from 'src/modules/shared/application/presets/common/preset.types';
import type { IMasterServiceFiltersPreset } from '../types/master-service-filters-preset.types';

export const MASTER_SERVICE_LIST_ORDER_FIELDS = [
  'id',
  'name',
  'price',
  'masterProfileId',
  'createdAt',
  'updatedAt',
] as const;

export type TMasterServiceListOrderField =
  (typeof MASTER_SERVICE_LIST_ORDER_FIELDS)[number];

export interface IGetMasterServicesQueryPayload {
  preset?: TPresetType;
  limit?: number;
  page?: number;
  orderField?: TMasterServiceListOrderField;
  orderDir?: 'asc' | 'desc';
  filter?: IMasterServiceFiltersPreset;
  requiredIds?: string[];
}

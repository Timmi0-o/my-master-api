import type { TPresetType } from 'src/modules/shared/application/presets/common/preset.types';
import type { IMasterProfileFiltersPreset } from 'src/modules/masters/application/presets/master-profile-filters-preset.types';

export const MASTER_PROFILE_LIST_ORDER_FIELDS = [
  'id',
  'userId',
  'displayName',
  'rating',
  'createdAt',
  'updatedAt',
] as const;

export type TMasterProfileListOrderField =
  (typeof MASTER_PROFILE_LIST_ORDER_FIELDS)[number];

export interface IGetMasterProfilesQueryPayload {
  preset?: TPresetType;
  limit?: number;
  page?: number;
  orderField?: TMasterProfileListOrderField;
  orderDir?: 'asc' | 'desc';
  filter?: IMasterProfileFiltersPreset;
  requiredIds?: string[];
}

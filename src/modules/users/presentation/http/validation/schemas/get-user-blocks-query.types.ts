import type { TPresetType } from 'src/modules/shared/application/presets/common/preset.types';
import type { IUserBlockFiltersPreset } from '../types/user-block-filters-preset.types';

export const USER_BLOCK_LIST_ORDER_FIELDS = [
  'id',
  'blockerUserId',
  'blockedUserId',
  'createdAt',
  'updatedAt',
] as const;

export type TUserBlockListOrderField =
  (typeof USER_BLOCK_LIST_ORDER_FIELDS)[number];

export interface IGetUserBlocksQueryPayload {
  preset?: TPresetType;
  limit?: number;
  page?: number;
  orderField?: TUserBlockListOrderField;
  orderDir?: 'asc' | 'desc';
  filter?: IUserBlockFiltersPreset;
  requiredIds?: string[];
}

import type { TPresetType } from 'src/modules/shared/application/presets/common/preset.types';
import type { IUserProfileFiltersPreset } from '../types/user-profile-filters-preset.types';

export const USER_PROFILE_LIST_ORDER_FIELDS = [
  'id',
  'userId',
  'displayName',
  'rating',
  'createdAt',
  'updatedAt',
] as const;

export type TUserProfileListOrderField =
  (typeof USER_PROFILE_LIST_ORDER_FIELDS)[number];

export interface IGetUserProfilesQueryPayload {
  preset?: TPresetType;
  limit?: number;
  page?: number;
  orderField?: TUserProfileListOrderField;
  orderDir?: 'asc' | 'desc';
  filter?: IUserProfileFiltersPreset;
  requiredIds?: string[];
}

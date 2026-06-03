import type { TPresetType } from 'src/modules/shared/application/presets/common/preset.types';
import type { IUserFiltersPreset } from 'src/modules/users/application/presets/user-filters-preset.types';

export const USER_LIST_ORDER_FIELDS = [
  'id',
  'email',
  'username',
  'name',
  'surname',
  'createdAt',
  'updatedAt',
] as const;

export type TUserListOrderField = (typeof USER_LIST_ORDER_FIELDS)[number];

export interface IGetUsersQueryPayload {
  preset?: TPresetType;
  limit?: number;
  page?: number;
  orderField?: TUserListOrderField;
  orderDir?: 'asc' | 'desc';
  filter?: IUserFiltersPreset;
  requiredIds?: string[];
}

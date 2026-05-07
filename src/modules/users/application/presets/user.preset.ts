import type { PresetConfig } from 'src/modules/shared/application/presets/common/preset-base.types';
import type { TPresetType } from 'src/modules/shared/application/presets/common/preset.types';
import { createPresetGetter } from 'src/modules/shared/application/presets/common/presets.helpers';
import type { IUserPublicEntity } from '../../domain/entities/user/i-user-entity';

export type IUserPresetConfig = PresetConfig<IUserPublicEntity>;

export const USER_PRESETS: Record<TPresetType, IUserPresetConfig> = {
  MINIMAL: {
    select: ['id', 'email', 'username', 'role', 'status'],
  },
  SHORT: {
    select: [
      'id',
      'email',
      'phone',
      'username',
      'role',
      'status',
      'language',
      'name',
      'surname',
      'createdAt',
      'updatedAt',
    ],
  },
  BASE: {
    select: [
      'id',
      'email',
      'phone',
      'username',
      'role',
      'status',
      'language',
      'name',
      'surname',
      'patronymic',
      'createdAt',
      'updatedAt',
      'deletedAt',
    ],
  },
};

export const getUserPresetConfig = createPresetGetter(USER_PRESETS);

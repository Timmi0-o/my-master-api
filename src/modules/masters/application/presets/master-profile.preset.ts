import type { PresetConfig } from 'src/modules/shared/application/presets/common/preset-base.types';
import type { TPresetType } from 'src/modules/shared/application/presets/common/preset.types';
import { createPresetGetter } from 'src/modules/shared/application/presets/common/presets.helpers';
import type { IMasterProfilePublicEntity } from '../../domain/entities/master-profile';

export type IMasterProfilePresetConfig = PresetConfig<IMasterProfilePublicEntity>;

export const MASTER_PROFILE_PRESETS: Record<
  TPresetType,
  IMasterProfilePresetConfig
> = {
  MINIMAL: {
    select: ['id', 'userId', 'displayName', 'rating'],
  },
  SHORT: {
    select: [
      'id',
      'userId',
      'displayName',
      'description',
      'rating',
      'createdAt',
      'updatedAt',
    ],
  },
  BASE: {
    select: [
      'id',
      'userId',
      'displayName',
      'description',
      'rating',
      'createdAt',
      'updatedAt',
      'deletedAt',
    ],
  },
};

export const getMasterProfilePresetConfig = createPresetGetter(
  MASTER_PROFILE_PRESETS,
);

import type { PresetConfig } from 'src/modules/shared/application/presets/common/preset-base.types';
import type { TPresetType } from 'src/modules/shared/application/presets/common/preset.types';
import { createPresetGetter } from 'src/modules/shared/application/presets/common/presets.helpers';
import type { IMasterProfilePublicEntity } from '../../domain/entities/master-profile';
import type { IMasterServicePublicEntity } from '../../domain/entities/master-service';

export type IMasterProfilePresetInclude = {
  services: {
    select: Array<keyof IMasterServicePublicEntity & string>;
  };
};

export type IMasterProfilePresetConfig = PresetConfig<
  IMasterProfilePublicEntity,
  IMasterProfilePresetInclude
>;

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
    include: {
      services: {
        select: [
          'id',
          'name',
          'description',
          'price',
          'masterProfileId',
          'createdAt',
          'updatedAt',
        ],
      },
    },
  },
};

export const getMasterProfilePresetConfig = createPresetGetter(
  MASTER_PROFILE_PRESETS,
);

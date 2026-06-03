import type { PresetConfig } from 'src/modules/shared/application/presets/common/preset-base.types';
import type { TPresetType } from 'src/modules/shared/application/presets/common/preset.types';
import { createPresetGetter } from 'src/modules/shared/application/presets/common/presets.helpers';
import type { IMasterProfilePublicEntity } from '../../domain/entities/master-profile';
import type { IMasterServicePublicEntity } from '../../domain/entities/master-service';

export type IMasterServicePresetInclude = {
  masterProfile: {
    select: Array<keyof IMasterProfilePublicEntity & string>;
  };
};

export type IMasterServicePresetConfig = PresetConfig<
  IMasterServicePublicEntity,
  IMasterServicePresetInclude
>;

export const MASTER_SERVICE_PRESETS: Record<
  TPresetType,
  IMasterServicePresetConfig
> = {
  MINIMAL: {
    select: ['id', 'masterProfileId', 'name', 'price'],
  },
  SHORT: {
    select: [
      'id',
      'masterProfileId',
      'name',
      'description',
      'price',
      'createdAt',
      'updatedAt',
    ],
  },
  BASE: {
    select: [
      'id',
      'masterProfileId',
      'name',
      'description',
      'price',
      'createdAt',
      'updatedAt',
      'deletedAt',
    ],
    include: {
      masterProfile: {
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
    },
  },
};

export const getMasterServicePresetConfig = createPresetGetter(
  MASTER_SERVICE_PRESETS,
);

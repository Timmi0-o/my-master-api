import { GET_MANY_MAX_LIMIT } from 'src/constants';
import { PRESET_TYPES } from 'src/modules/shared/application/presets/common/preset.types';

export const idSchema = {
  type: 'string' as const,
  format: 'uuid' as const,
};

export const presetSchema = {
  type: 'string' as const,
  enum: [...PRESET_TYPES],
};

export const limitSchema = {
  type: 'number' as const,
  minimum: 1,
  maximum: GET_MANY_MAX_LIMIT,
  nullable: true as const,
};

export const pageSchema = {
  type: 'number' as const,
  minimum: 1,
  nullable: true as const,
};

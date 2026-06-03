import type { TPresetType } from 'src/modules/shared/application/presets/common/preset.types';
import { presetConfigToSelectOptions } from 'src/modules/shared/application/presets/common/preset-to-select-options.mapper';
import type { SelectOptions } from 'src/modules/shared/domain/query';
import type { IUserPublicEntity } from 'src/modules/users/domain/entities/user';
import { getUserPresetConfig } from 'src/modules/users/application/presets';

export function presetToSelectOptions(
  preset: TPresetType | undefined,
  isStaffUser: boolean,
): SelectOptions<IUserPublicEntity, Record<never, never>> {
  const presetConfig = getUserPresetConfig(preset ?? 'SHORT');

  return presetConfigToSelectOptions<IUserPublicEntity>(presetConfig, isStaffUser);
}

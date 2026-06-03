import type { TPresetType } from 'src/modules/shared/application/presets/common/preset.types';
import { presetConfigToSelectOptions } from 'src/modules/shared/application/presets/common/preset-to-select-options.mapper';
import type {
  IMasterProfilePublicEntity,
  IMasterProfileRelations,
} from 'src/modules/masters/domain/entities/master-profile';
import type { SelectOptions } from 'src/modules/shared/domain/query';
import { getMasterProfilePresetConfig } from 'src/modules/masters/application/presets';

export function masterProfilePresetToSelectOptions(
  preset: TPresetType | undefined,
  isStaffUser: boolean,
): SelectOptions<IMasterProfilePublicEntity, IMasterProfileRelations> {
  const presetConfig = getMasterProfilePresetConfig(preset ?? 'SHORT');

  return presetConfigToSelectOptions<
    IMasterProfilePublicEntity,
    IMasterProfileRelations
  >(presetConfig, isStaffUser);
}

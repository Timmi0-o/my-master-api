import type { TPresetType } from 'src/modules/shared/application/presets/common/preset.types';
import { presetConfigToSelectOptions } from 'src/modules/shared/application/presets/common/preset-to-select-options.mapper';
import type {
  IMasterServicePublicEntity,
  IMasterServiceRelations,
} from 'src/modules/masters/domain/entities/master-service';
import type { SelectOptions } from 'src/modules/shared/domain/query';
import { getMasterServicePresetConfig } from 'src/modules/masters/application/presets';

export function masterServicePresetToSelectOptions(
  preset: TPresetType | undefined,
  isStaffUser: boolean,
): SelectOptions<IMasterServicePublicEntity, IMasterServiceRelations> {
  const presetConfig = getMasterServicePresetConfig(preset ?? 'SHORT');

  return presetConfigToSelectOptions<
    IMasterServicePublicEntity,
    IMasterServiceRelations
  >(presetConfig, isStaffUser);
}

import type { QuerySelect, SelectOptions } from 'src/modules/shared/domain/query';
import { omitDisallowedSelectFieldsForNonStaff } from 'src/modules/shared/application/presets/common/query-filter.helper';
import type { TPresetType } from 'src/modules/shared/application/presets/common/preset.types';
import type { IMasterServicePublicEntity } from 'src/modules/masters/domain/entities/master-service';
import { getMasterServicePresetConfig } from 'src/modules/masters/application/presets';

export function masterServicePresetToSelectOptions(
  preset: TPresetType | undefined,
  isStaffUser: boolean,
): SelectOptions<IMasterServicePublicEntity, Record<never, never>> {
  const presetConfig = getMasterServicePresetConfig(preset ?? 'SHORT');
  const select = omitDisallowedSelectFieldsForNonStaff(
    presetConfig.select,
    isStaffUser,
  );

  return { select: select as QuerySelect<IMasterServicePublicEntity> | undefined };
}

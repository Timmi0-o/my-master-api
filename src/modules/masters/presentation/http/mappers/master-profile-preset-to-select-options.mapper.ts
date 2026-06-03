import type { QuerySelect, SelectOptions } from 'src/modules/shared/domain/query';
import { omitDisallowedSelectFieldsForNonStaff } from 'src/modules/shared/application/presets/common/query-filter.helper';
import type { TPresetType } from 'src/modules/shared/application/presets/common/preset.types';
import type { IMasterProfilePublicEntity } from 'src/modules/masters/domain/entities/master-profile';
import { getMasterProfilePresetConfig } from 'src/modules/masters/application/presets';

export function masterProfilePresetToSelectOptions(
  preset: TPresetType | undefined,
  isStaffUser: boolean,
): SelectOptions<IMasterProfilePublicEntity, Record<never, never>> {
  const presetConfig = getMasterProfilePresetConfig(preset ?? 'SHORT');
  const select = omitDisallowedSelectFieldsForNonStaff(
    presetConfig.select,
    isStaffUser,
  );

  return { select: select as QuerySelect<IMasterProfilePublicEntity> | undefined };
}

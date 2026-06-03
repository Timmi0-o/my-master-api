import type { QuerySelect, SelectOptions } from 'src/modules/shared/domain/query';
import {
  omitDisallowedSelectFieldsForNonStaff,
} from 'src/modules/shared/application/presets/common/query-filter.helper';
import type { TPresetType } from 'src/modules/shared/application/presets/common/preset.types';
import type { IUserPublicEntity } from 'src/modules/users/domain/entities/user';
import { getUserPresetConfig } from 'src/modules/users/application/presets';

export function presetToSelectOptions(
  preset: TPresetType | undefined,
  isStaffUser: boolean,
): SelectOptions<IUserPublicEntity, Record<never, never>> {
  const presetConfig = getUserPresetConfig(preset ?? 'SHORT');
  const select = omitDisallowedSelectFieldsForNonStaff(
    presetConfig.select,
    isStaffUser,
  );

  return { select: select as QuerySelect<IUserPublicEntity> | undefined };
}

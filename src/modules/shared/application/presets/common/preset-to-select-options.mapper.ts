import type { PresetConfig } from 'src/modules/shared/application/presets/common/preset-base.types';
import { omitDisallowedSelectFieldsForNonStaff } from 'src/modules/shared/application/presets/common/query-filter.helper';
import type {
  QueryInclude,
  QuerySelect,
  SelectOptions,
} from 'src/modules/shared/domain/query';

export function presetConfigToSelectOptions<
  T extends object,
  R extends object = Record<never, never>,
>(
  presetConfig: PresetConfig<T, QueryInclude<T, R>>,
  isStaffUser: boolean,
): SelectOptions<T, R> {
  const selectFields = presetConfig.select as string[] | undefined;
  const select = omitDisallowedSelectFieldsForNonStaff(selectFields, isStaffUser);

  return {
    select: select as QuerySelect<T> | undefined,
    include: presetConfig.include as QueryInclude<T, R> | undefined,
  };
}

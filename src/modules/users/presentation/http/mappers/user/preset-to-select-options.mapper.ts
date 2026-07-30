import type { TPresetType } from 'src/modules/shared/application/presets/common/preset.types';
import type { PresetReadOptions } from 'src/modules/shared/application/presets/common/preset-base.types';
import { omitDisallowedSelectFieldsForNonStaff } from 'src/modules/shared/presentation/http/mappers/shared/staff-visibility.helper';
import type { IUserPublicEntity } from 'src/modules/users/domain/entities/user';
import { USER_SELECT_FIELDS, USER_STAFF_ONLY_FIELDS } from 'src/modules/users/domain/entities/user/user-select-fields';

type UserSelectOptions = PresetReadOptions<IUserPublicEntity, Record<never, never>>;

const USER_PRESETS: Record<TPresetType, UserSelectOptions> = {
  MINIMAL: {
    select: ['id', 'email', 'username', 'roleId', 'status'],
  },
  SHORT: {
    select: [
      'id',
      'email',
      'phone',
      'username',
      'roleId',
      'status',
      'language',
      'name',
      'surname',
      'createdAt',
      'updatedAt',
    ],
  },
  BASE: {
    select: [
      'id',
      'email',
      'phone',
      'username',
      'roleId',
      'status',
      'language',
      'name',
      'surname',
      'patronymic',
      'createdAt',
      'updatedAt',
      'deletedAt',
    ],
  },
};

export function presetToSelectOptions(
  preset: TPresetType | undefined,
  isStaffUser: boolean,
): PresetReadOptions<IUserPublicEntity, Record<never, never>> {
  const config = USER_PRESETS[preset ?? 'SHORT'];
  const select = omitDisallowedSelectFieldsForNonStaff(
    config.select,
    isStaffUser,
    USER_STAFF_ONLY_FIELDS,
  );

  return {
    select: select as UserSelectOptions['select'],
    include: config.include,
    enrich: config.enrich,
  };
}

export { USER_SELECT_FIELDS };

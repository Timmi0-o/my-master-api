import type { TPresetType } from 'src/modules/shared/application/presets/common/preset.types';
import type { SelectOptions } from 'src/modules/shared/domain/query';
import { omitDisallowedSelectFieldsForNonStaff } from 'src/modules/shared/presentation/http/mappers/shared/staff-visibility.helper';
import type { IUserPublicEntity } from 'src/modules/users/domain/entities/user';
import { USER_SELECT_FIELDS } from 'src/modules/users/domain/entities/user/user-select-fields';

type UserSelectOptions = SelectOptions<IUserPublicEntity, Record<never, never>>;

const USER_PRESETS: Record<TPresetType, UserSelectOptions> = {
  MINIMAL: {
    select: ['id', 'email', 'username', 'role', 'status'],
  },
  SHORT: {
    select: [
      'id',
      'email',
      'phone',
      'username',
      'role',
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
      'role',
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
): SelectOptions<IUserPublicEntity, Record<never, never>> {
  const config = USER_PRESETS[preset ?? 'SHORT'];
  const select = omitDisallowedSelectFieldsForNonStaff(
    config.select,
    isStaffUser,
  );

  return {
    select: select as UserSelectOptions['select'],
    include: config.include,
  };
}

export { USER_SELECT_FIELDS };

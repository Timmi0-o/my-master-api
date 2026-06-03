import type { IUserProfilePublicEntity } from 'src/modules/users/domain/entities/user-profile';
import { USER_PROFILE_SELECT_FIELDS } from 'src/modules/users/domain/entities/user-profile/user-profile--select-fields';
import type { SelectOptions } from 'src/modules/shared/domain/query';
import type { TPresetType } from 'src/modules/shared/application/presets/common/preset.types';
import { omitDisallowedSelectFieldsForNonStaff } from 'src/modules/shared/presentation/http/mappers/shared/staff-visibility.helper';

type UserProfileSelectOptions = SelectOptions<
  IUserProfilePublicEntity,
  Record<never, never>
>;

const USER_PROFILE_PRESETS: Record<TPresetType, UserProfileSelectOptions> = {
  MINIMAL: {
    select: ['id', 'userId', 'displayName', 'rating'],
  },
  SHORT: {
    select: [
      'id',
      'userId',
      'displayName',
      'rating',
      'createdAt',
      'updatedAt',
    ],
  },
  BASE: {
    select: [
      'id',
      'userId',
      'displayName',
      'rating',
      'createdAt',
      'updatedAt',
      'deletedAt',
    ],
  },
};

export function presetToSelectOptions(
  preset: TPresetType | undefined,
  isStaffUser: boolean,
): SelectOptions<IUserProfilePublicEntity, Record<never, never>> {
  const config = USER_PROFILE_PRESETS[preset ?? 'SHORT'];
  const select = omitDisallowedSelectFieldsForNonStaff(
    config.select,
    isStaffUser,
  );

  return {
    select: select as UserProfileSelectOptions['select'],
    include: config.include,
  };
}

export { USER_PROFILE_SELECT_FIELDS };

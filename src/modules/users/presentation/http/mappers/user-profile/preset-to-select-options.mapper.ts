import type {
  IUserProfilePublicEntity,
  IUserProfileRelations,
} from 'src/modules/users/domain/entities/user-profile';
import { USER_PROFILE_SELECT_FIELDS } from 'src/modules/users/domain/entities/user-profile/user-profile--select-fields';
import { IMAGE_FILE_SELECT_FIELDS } from 'src/modules/masters/domain/entities/image';
import type { SelectOptions } from 'src/modules/shared/domain/query';
import type { TPresetType } from 'src/modules/shared/application/presets/common/preset.types';
import { omitDisallowedSelectFieldsForNonStaff } from 'src/modules/shared/presentation/http/mappers/shared/staff-visibility.helper';

type UserProfileSelectOptions = SelectOptions<
  IUserProfilePublicEntity,
  IUserProfileRelations
>;

const AVATAR_INCLUDE = {
  avatar: {
    include: {
      file: {
        select: [...IMAGE_FILE_SELECT_FIELDS],
      },
    },
  },
} as const;

const USER_PROFILE_PRESETS: Record<TPresetType, UserProfileSelectOptions> = {
  MINIMAL: {
    select: ['id', 'userId', 'displayName', 'rating'],
    include: AVATAR_INCLUDE,
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
    include: AVATAR_INCLUDE,
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
    include: AVATAR_INCLUDE,
  },
};

export function presetToSelectOptions(
  preset: TPresetType | undefined,
  isStaffUser: boolean,
): SelectOptions<IUserProfilePublicEntity, IUserProfileRelations> {
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

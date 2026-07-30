import type {
  IUserProfilePublicEntity,
  IUserProfileRelations,
} from 'src/modules/users/domain/entities/user-profile';
import { USER_PROFILE_SELECT_FIELDS } from 'src/modules/users/domain/entities/user-profile/user-profile--select-fields';
import { IMAGE_FILE_SELECT_FIELDS } from 'src/modules/masters/domain/entities/image';
import type { PresetReadOptions } from 'src/modules/shared/application/presets/common/preset-base.types';
import type { TPresetType } from 'src/modules/shared/application/presets/common/preset.types';
import { omitDisallowedSelectFieldsForNonStaff } from 'src/modules/shared/presentation/http/mappers/shared/staff-visibility.helper';

type UserProfilePresetOptions = PresetReadOptions<
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

const USER_PROFILE_PRESETS: Record<TPresetType, UserProfilePresetOptions> = {
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
    enrich: { personalNotes: true },
  },
};

export function presetToSelectOptions(
  preset: TPresetType | undefined,
  isStaffUser: boolean,
): PresetReadOptions<IUserProfilePublicEntity, IUserProfileRelations> {
  const config = USER_PROFILE_PRESETS[preset ?? 'SHORT'];
  const select = omitDisallowedSelectFieldsForNonStaff(
    config.select,
    isStaffUser,
  );

  return {
    select: select as UserProfilePresetOptions['select'],
    include: config.include,
    enrich: config.enrich,
  };
}

export { USER_PROFILE_SELECT_FIELDS };

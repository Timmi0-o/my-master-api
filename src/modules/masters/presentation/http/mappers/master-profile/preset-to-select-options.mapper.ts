import type {
  IMasterProfilePublicEntity,
  IMasterProfileRelations,
} from 'src/modules/masters/domain/entities/master-profile';
import { MASTER_PROFILE_SELECT_FIELDS } from 'src/modules/masters/domain/entities/master-profile/master-profile-select-fields';
import { IMAGE_FILE_SELECT_FIELDS } from 'src/modules/masters/domain/entities/image';
import type { TPresetType } from 'src/modules/shared/application/presets/common/preset.types';
import type { SelectOptions } from 'src/modules/shared/domain/query';
import { omitDisallowedSelectFieldsForNonStaff } from 'src/modules/shared/presentation/http/mappers/shared/staff-visibility.helper';

export const MASTER_PROFILE_PRESET_VALUES = [
  'MINIMAL',
  'SHORT',
  'BASE',
] as const;

type MasterProfileSelectOptions = SelectOptions<
  IMasterProfilePublicEntity,
  IMasterProfileRelations
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

const MASTER_PROFILE_PRESETS: Record<TPresetType, MasterProfileSelectOptions> =
  {
    MINIMAL: {
      select: ['id', 'userId', 'displayName', 'rating'],
      include: AVATAR_INCLUDE,
    },
    SHORT: {
      select: [
        'id',
        'userId',
        'displayName',
        'description',
        'rating',
        'timezone',
        'bookingStatus',
        'pausedUntil',
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
        'description',
        'rating',
        'timezone',
        'bookingStatus',
        'pausedUntil',
        'minNoticeMinutes',
        'maxBookingDaysAhead',
        'slotStepMinutes',
        'bufferBetweenAppointmentsMinutes',
        'createdAt',
        'updatedAt',
        'deletedAt',
      ],
      include: {
        ...AVATAR_INCLUDE,
        services: {
          include: {
            images: {
              include: {
                file: {
                  select: [...IMAGE_FILE_SELECT_FIELDS],
                },
              },
            },
          },
        },
      },
    },
  };

export function presetToSelectOptions(
  preset: TPresetType | undefined,
  isStaffUser: boolean,
): SelectOptions<IMasterProfilePublicEntity, IMasterProfileRelations> {
  const config = MASTER_PROFILE_PRESETS[preset ?? 'SHORT'];
  const select = omitDisallowedSelectFieldsForNonStaff(
    config.select,
    isStaffUser,
  );

  return {
    select: select as MasterProfileSelectOptions['select'],
    include: config.include,
  };
}

export { MASTER_PROFILE_SELECT_FIELDS };

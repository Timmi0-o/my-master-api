import type {
  IMasterProfilePublicEntity,
  IMasterProfileRelations,
} from 'src/modules/masters/domain/entities/master-profile';
import { MASTER_PROFILE_SELECT_FIELDS, MASTER_PROFILE_STAFF_ONLY_FIELDS } from 'src/modules/masters/domain/entities/master-profile/master-profile-select-fields';
import { IMAGE_FILE_SELECT_FIELDS } from 'src/modules/masters/domain/entities/image';
import type { PresetReadOptions } from 'src/modules/shared/application/presets/common/preset-base.types';
import type { TPresetType } from 'src/modules/shared/application/presets/common/preset.types';
import { omitDisallowedSelectFieldsForNonStaff } from 'src/modules/shared/presentation/http/mappers/shared/staff-visibility.helper';

export const MASTER_PROFILE_PRESET_VALUES = [
  'MINIMAL',
  'SHORT',
  'BASE',
] as const;

type MasterProfilePresetOptions = PresetReadOptions<
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

const BANNER_INCLUDE = {
  banner: {
    include: {
      file: {
        select: [...IMAGE_FILE_SELECT_FIELDS],
      },
    },
  },
} as const;

const PROFILE_MEDIA_INCLUDE = {
  ...AVATAR_INCLUDE,
  ...BANNER_INCLUDE,
} as const;

const MASTER_PROFILE_PRESETS: Record<TPresetType, MasterProfilePresetOptions> =
  {
    MINIMAL: {
      select: ['id', 'userId', 'displayName', 'rating'],
      include: PROFILE_MEDIA_INCLUDE,
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
      include: PROFILE_MEDIA_INCLUDE,
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
        ...PROFILE_MEDIA_INCLUDE,
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
      enrich: { personalNotes: true },
    },
  };

export function presetToSelectOptions(
  preset: TPresetType | undefined,
  isStaffUser: boolean,
): PresetReadOptions<IMasterProfilePublicEntity, IMasterProfileRelations> {
  const config = MASTER_PROFILE_PRESETS[preset ?? 'SHORT'];
  const select = omitDisallowedSelectFieldsForNonStaff(
    config.select,
    isStaffUser,
    MASTER_PROFILE_STAFF_ONLY_FIELDS,
  );

  return {
    select: select as MasterProfilePresetOptions['select'],
    include: config.include,
    enrich: config.enrich,
  };
}

export { MASTER_PROFILE_SELECT_FIELDS };

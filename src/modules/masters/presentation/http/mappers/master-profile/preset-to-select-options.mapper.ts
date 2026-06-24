import type {
  IMasterProfilePublicEntity,
  IMasterProfileRelations,
} from 'src/modules/masters/domain/entities/master-profile';
import { MASTER_PROFILE_SELECT_FIELDS } from 'src/modules/masters/domain/entities/master-profile/master-profile-select-fields';
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

const MASTER_PROFILE_PRESETS: Record<TPresetType, MasterProfileSelectOptions> =
  {
    MINIMAL: {
      select: ['id', 'userId', 'displayName', 'rating'],
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
        services: {
          include: {
            images: {
              include: {
                file: {
                  select: [
                    'id',
                    'fileUrl',
                    'originalName',
                    'mimeType',
                    'fileType',
                    'purpose',
                    'accessLevel',
                    'status',
                    'fileSize',
                    'createdAt',
                    'updatedAt',
                  ] as const,
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

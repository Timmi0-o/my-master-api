import { IMAGE_FILE_SELECT_FIELDS } from 'src/modules/masters/domain/entities/image';
import type {
  IMasterServicePublicEntity,
  IMasterServiceRelations,
} from 'src/modules/masters/domain/entities/master-service';
import { MASTER_SERVICE_SELECT_FIELDS, MASTER_SERVICE_STAFF_ONLY_FIELDS } from 'src/modules/masters/domain/entities/master-service/master-service-select-fields';
import type { TPresetType } from 'src/modules/shared/application/presets/common/preset.types';
import type { PresetReadOptions } from 'src/modules/shared/application/presets/common/preset-base.types';
import { omitDisallowedSelectFieldsForNonStaff } from 'src/modules/shared/presentation/http/request-mappers/shared/staff-visibility.helper';

type MasterServiceSelectOptions = PresetReadOptions<
  IMasterServicePublicEntity,
  IMasterServiceRelations
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

const MASTER_SERVICE_PRESETS: Record<TPresetType, MasterServiceSelectOptions> =
  {
    MINIMAL: {
      select: [
        'id',
        'masterProfileId',
        'name',
        'price',
        'rating',
        'durationMinutes',
        'category',
        'tags',
      ],
    },
    SHORT: {
      select: [
        'id',
        'masterProfileId',
        'name',
        'description',
        'price',
        'rating',
        'durationMinutes',
        'category',
        'tags',
        'createdAt',
        'updatedAt',
      ],
    },
    BASE: {
      select: [
        'id',
        'masterProfileId',
        'name',
        'description',
        'price',
        'rating',
        'durationMinutes',
        'category',
        'tags',
        'createdAt',
        'updatedAt',
        'deletedAt',
      ],
      include: {
        masterProfile: {
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
          ] as const,
          include: AVATAR_INCLUDE,
        },
        images: {
          include: {
            file: {
              select: [...IMAGE_FILE_SELECT_FIELDS],
            },
          },
        },
      },
    },
  };

export function presetToSelectOptions(
  preset: TPresetType | undefined,
  isStaffUser: boolean,
): PresetReadOptions<IMasterServicePublicEntity, IMasterServiceRelations> {
  const config = MASTER_SERVICE_PRESETS[preset ?? 'SHORT'];
  const select = omitDisallowedSelectFieldsForNonStaff(
    config.select,
    isStaffUser,
    MASTER_SERVICE_STAFF_ONLY_FIELDS,
  );

  return {
    select: select as MasterServiceSelectOptions['select'],
    include: config.include,
    enrich: config.enrich,
  };
}

export { MASTER_SERVICE_SELECT_FIELDS };

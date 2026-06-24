import type {
  IMasterServicePublicEntity,
  IMasterServiceRelations,
} from 'src/modules/masters/domain/entities/master-service';
import { MASTER_SERVICE_SELECT_FIELDS } from 'src/modules/masters/domain/entities/master-service/master-service-select-fields';
import type { TPresetType } from 'src/modules/shared/application/presets/common/preset.types';
import type { SelectOptions } from 'src/modules/shared/domain/query';
import { omitDisallowedSelectFieldsForNonStaff } from 'src/modules/shared/presentation/http/mappers/shared/staff-visibility.helper';

type MasterServiceSelectOptions = SelectOptions<
  IMasterServicePublicEntity,
  IMasterServiceRelations
>;

const MASTER_SERVICE_PRESETS: Record<TPresetType, MasterServiceSelectOptions> =
  {
    MINIMAL: {
      select: ['id', 'masterProfileId', 'name', 'price', 'durationMinutes'],
    },
    SHORT: {
      select: [
        'id',
        'masterProfileId',
        'name',
        'description',
        'price',
        'durationMinutes',
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
        'durationMinutes',
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
        },
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
  };

export function presetToSelectOptions(
  preset: TPresetType | undefined,
  isStaffUser: boolean,
): SelectOptions<IMasterServicePublicEntity, IMasterServiceRelations> {
  const config = MASTER_SERVICE_PRESETS[preset ?? 'SHORT'];
  const select = omitDisallowedSelectFieldsForNonStaff(
    config.select,
    isStaffUser,
  );

  return {
    select: select as MasterServiceSelectOptions['select'],
    include: config.include,
  };
}

export { MASTER_SERVICE_SELECT_FIELDS };

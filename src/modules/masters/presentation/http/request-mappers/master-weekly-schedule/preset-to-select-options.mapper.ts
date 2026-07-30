import type {
  IMasterWeeklySchedulePublicEntity,
  IMasterWeeklyScheduleRelations,
} from 'src/modules/masters/domain/entities/master-weekly-schedule';
import { MASTER_WEEKLY_SCHEDULE_SELECT_FIELDS, MASTER_WEEKLY_SCHEDULE_STAFF_ONLY_FIELDS } from 'src/modules/masters/domain/entities/master-weekly-schedule/master-weekly-schedule-select-fields';
import type { PresetReadOptions } from 'src/modules/shared/application/presets/common/preset-base.types';
import type { TPresetType } from 'src/modules/shared/application/presets/common/preset.types';
import { omitDisallowedSelectFieldsForNonStaff } from 'src/modules/shared/presentation/http/request-mappers/shared/staff-visibility.helper';

type MasterWeeklyScheduleSelectOptions = PresetReadOptions<
  IMasterWeeklySchedulePublicEntity,
  IMasterWeeklyScheduleRelations
>;

const MASTER_WEEKLY_SCHEDULE_PRESETS: Record<
  TPresetType,
  MasterWeeklyScheduleSelectOptions
> = {
  MINIMAL: {
    select: ['id', 'masterProfileId', 'dayOfWeek', 'startTime', 'endTime'],
  },
  SHORT: {
    select: [
      'id',
      'masterProfileId',
      'dayOfWeek',
      'startTime',
      'endTime',
      'createdAt',
      'updatedAt',
    ],
  },
  BASE: {
    select: [
      'id',
      'masterProfileId',
      'dayOfWeek',
      'startTime',
      'endTime',
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
    },
  },
};

export function presetToSelectOptions(
  preset: TPresetType | undefined,
  isStaffUser: boolean,
): PresetReadOptions<
  IMasterWeeklySchedulePublicEntity,
  IMasterWeeklyScheduleRelations
> {
  const config = MASTER_WEEKLY_SCHEDULE_PRESETS[preset ?? 'SHORT'];
  const select = omitDisallowedSelectFieldsForNonStaff(
    config.select,
    isStaffUser,
    MASTER_WEEKLY_SCHEDULE_STAFF_ONLY_FIELDS,
  );

  return {
    select: select as MasterWeeklyScheduleSelectOptions['select'],
    include: config.include,
    enrich: config.enrich,
  };
}

export { MASTER_WEEKLY_SCHEDULE_SELECT_FIELDS };

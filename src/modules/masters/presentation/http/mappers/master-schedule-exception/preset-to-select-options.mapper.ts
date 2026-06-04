import type {
  IMasterScheduleExceptionPublicEntity,
  IMasterScheduleExceptionRelations,
} from 'src/modules/masters/domain/entities/master-schedule-exception';
import { MASTER_SCHEDULE_EXCEPTION_SELECT_FIELDS } from 'src/modules/masters/domain/entities/master-schedule-exception/master-schedule-exception-select-fields';
import type { SelectOptions } from 'src/modules/shared/domain/query';
import type { TPresetType } from 'src/modules/shared/application/presets/common/preset.types';
import { omitDisallowedSelectFieldsForNonStaff } from 'src/modules/shared/presentation/http/mappers/shared/staff-visibility.helper';

type MasterScheduleExceptionSelectOptions = SelectOptions<
  IMasterScheduleExceptionPublicEntity,
  IMasterScheduleExceptionRelations
>;

const MASTER_SCHEDULE_EXCEPTION_PRESETS: Record<
  TPresetType,
  MasterScheduleExceptionSelectOptions
> = {
  MINIMAL: {
    select: ['id', 'masterProfileId', 'startsAt', 'endsAt', 'kind'],
  },
  SHORT: {
    select: [
      'id',
      'masterProfileId',
      'startsAt',
      'endsAt',
      'kind',
      'title',
      'createdAt',
      'updatedAt',
    ],
  },
  BASE: {
    select: [
      'id',
      'masterProfileId',
      'startsAt',
      'endsAt',
      'kind',
      'customStartTime',
      'customEndTime',
      'title',
      'note',
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
): SelectOptions<
  IMasterScheduleExceptionPublicEntity,
  IMasterScheduleExceptionRelations
> {
  const config = MASTER_SCHEDULE_EXCEPTION_PRESETS[preset ?? 'SHORT'];
  const select = omitDisallowedSelectFieldsForNonStaff(
    config.select,
    isStaffUser,
  );

  return {
    select: select as MasterScheduleExceptionSelectOptions['select'],
    include: config.include,
  };
}

export { MASTER_SCHEDULE_EXCEPTION_SELECT_FIELDS };

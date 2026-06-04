import type { IMasterScheduleExceptionPublicEntity } from './i-master-schedule-exception-entity';

export const MASTER_SCHEDULE_EXCEPTION_SELECT_FIELDS = [
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
] as const satisfies readonly (keyof IMasterScheduleExceptionPublicEntity)[];

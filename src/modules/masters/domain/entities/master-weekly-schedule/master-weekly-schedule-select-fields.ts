import type { IMasterWeeklySchedulePublicEntity } from './i-master-weekly-schedule.entity';

export const MASTER_WEEKLY_SCHEDULE_SELECT_FIELDS = [
  'id',
  'masterProfileId',
  'dayOfWeek',
  'startTime',
  'endTime',
  'createdAt',
  'updatedAt',
  'deletedAt',
] as const satisfies readonly (keyof IMasterWeeklySchedulePublicEntity)[];

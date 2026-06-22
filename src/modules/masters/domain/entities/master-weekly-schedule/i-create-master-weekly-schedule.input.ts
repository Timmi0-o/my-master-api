import type { IMasterWeeklyScheduleEntity } from './i-master-weekly-schedule.entity';

export type ICreateMasterWeeklyScheduleInput = Omit<
  IMasterWeeklyScheduleEntity,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

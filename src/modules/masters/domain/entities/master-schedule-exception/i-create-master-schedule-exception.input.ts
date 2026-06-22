import type { IMasterScheduleExceptionEntity } from './i-master-schedule-exception.entity';

export type ICreateMasterScheduleExceptionInput = Omit<
  IMasterScheduleExceptionEntity,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

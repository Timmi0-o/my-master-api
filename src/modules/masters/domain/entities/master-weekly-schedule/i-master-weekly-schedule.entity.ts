import type { EDayOfWeek } from './master-weekly-schedule.enum';

export interface IMasterWeeklyScheduleEntity {
  id: string;
  masterProfileId: string;
  dayOfWeek: EDayOfWeek;
  startTime: string;
  endTime: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export type IMasterWeeklySchedulePublicEntity = IMasterWeeklyScheduleEntity;

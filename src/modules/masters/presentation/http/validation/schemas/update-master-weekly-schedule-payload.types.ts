import type { EDayOfWeek } from 'src/modules/masters/domain/entities/master-weekly-schedule';

export interface IUpdateMasterWeeklySchedulePayload {
  dayOfWeek?: EDayOfWeek;
  startTime?: string;
  endTime?: string;
}

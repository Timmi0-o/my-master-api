import type { EDayOfWeek } from 'src/modules/masters/domain/entities/master-weekly-schedule';

export interface ICreateMasterWeeklySchedulePayload {
  masterProfileId: string;
  dayOfWeek: EDayOfWeek;
  startTime: string;
  endTime: string;
}

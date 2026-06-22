import type { ICreateMasterWeeklyScheduleInput } from './i-create-master-weekly-schedule.input';

export type IUpdateMasterWeeklyScheduleInput = Partial<
  Omit<ICreateMasterWeeklyScheduleInput, 'masterProfileId'>
>;

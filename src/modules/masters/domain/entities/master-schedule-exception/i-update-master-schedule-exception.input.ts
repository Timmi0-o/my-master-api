import type { ICreateMasterScheduleExceptionInput } from './i-create-master-schedule-exception.input';

export type IUpdateMasterScheduleExceptionInput = Partial<
  Omit<ICreateMasterScheduleExceptionInput, 'masterProfileId'>
>;

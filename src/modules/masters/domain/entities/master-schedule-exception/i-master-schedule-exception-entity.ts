import type { EMasterScheduleExceptionKind } from './master-schedule-exception.enum';

export interface IMasterScheduleExceptionEntity {
  id: string;
  masterProfileId: string;
  startsAt: Date;
  endsAt: Date;
  kind: EMasterScheduleExceptionKind;
  customStartTime: string | null;
  customEndTime: string | null;
  title: string | null;
  note: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export type IMasterScheduleExceptionPublicEntity = IMasterScheduleExceptionEntity;

export type ICreateMasterScheduleExceptionInput = Omit<
  IMasterScheduleExceptionEntity,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

export type IUpdateMasterScheduleExceptionInput = Partial<
  Omit<ICreateMasterScheduleExceptionInput, 'masterProfileId'>
>;

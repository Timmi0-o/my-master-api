import type { EMasterScheduleExceptionKind } from 'src/modules/masters/domain/entities/master-schedule-exception';

export interface ICreateMasterScheduleExceptionPayload {
  masterProfileId: string;
  startsAt: string;
  endsAt: string;
  kind: EMasterScheduleExceptionKind;
  customStartTime?: string | null;
  customEndTime?: string | null;
  title?: string | null;
  note?: string | null;
}

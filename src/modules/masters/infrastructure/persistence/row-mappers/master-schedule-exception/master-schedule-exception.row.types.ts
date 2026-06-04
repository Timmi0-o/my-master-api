import type { EMasterScheduleExceptionKind } from 'src/modules/masters/domain/entities/master-schedule-exception/master-schedule-exception.enum';
import type { MasterProfileRelationRow } from '../master-service/master-service.row.types';

export type MasterScheduleExceptionRow = {
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
  deletedAt: Date | null;
  masterProfile?: MasterProfileRelationRow | null;
};

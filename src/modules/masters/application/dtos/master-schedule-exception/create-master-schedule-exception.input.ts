import type { IMasterActorInput } from '../common/i-master-actor.input';
import type { EMasterScheduleExceptionKind } from 'src/modules/masters/domain/entities/master-schedule-exception';

export interface ICreateMasterScheduleExceptionApplicationInput {
  masterProfileId: string;
  startsAt: Date;
  endsAt: Date;
  kind: EMasterScheduleExceptionKind;
  customStartTime?: string | null;
  customEndTime?: string | null;
  title?: string | null;
  note?: string | null;
  actor: IMasterActorInput;
}

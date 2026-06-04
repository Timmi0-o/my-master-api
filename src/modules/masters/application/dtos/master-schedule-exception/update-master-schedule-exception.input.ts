import type { IMasterActorInput } from '../common/i-master-actor.input';
import type { IUpdateMasterScheduleExceptionInput } from 'src/modules/masters/domain/entities/master-schedule-exception';

export interface IUpdateMasterScheduleExceptionApplicationInput {
  id: string;
  patch: IUpdateMasterScheduleExceptionInput;
  actor: IMasterActorInput;
}

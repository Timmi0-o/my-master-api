import type { IMasterActorInput } from '../common/i-master-actor.input';
import type { IUpdateMasterWeeklyScheduleInput } from 'src/modules/masters/domain/entities/master-weekly-schedule';

export interface IUpdateMasterWeeklyScheduleApplicationInput {
  id: string;
  patch: IUpdateMasterWeeklyScheduleInput;
  actor: IMasterActorInput;
}

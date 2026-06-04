import type { IMasterActorInput } from '../common/i-master-actor.input';
import type { EDayOfWeek } from 'src/modules/masters/domain/entities/master-weekly-schedule';

export interface ICreateMasterWeeklyScheduleApplicationInput {
  masterProfileId: string;
  dayOfWeek: EDayOfWeek;
  startTime: string;
  endTime: string;
  actor: IMasterActorInput;
}

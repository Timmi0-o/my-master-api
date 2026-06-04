import type { IMasterActorInput } from '../common/i-master-actor.input';
import type { FindOneParams } from 'src/modules/shared/domain/query';
import type {
  IMasterWeeklySchedulePublicEntity,
  IMasterWeeklyScheduleRelations,
} from 'src/modules/masters/domain/entities/master-weekly-schedule';

export interface IGetMasterWeeklyScheduleByIdApplicationInput {
  id: string;
  actor: IMasterActorInput;
  params: FindOneParams<
    IMasterWeeklySchedulePublicEntity,
    IMasterWeeklyScheduleRelations
  >;
}

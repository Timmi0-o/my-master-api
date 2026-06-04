import type { IMasterActorInput } from '../common/i-master-actor.input';
import type { FindOneParams } from 'src/modules/shared/domain/query';
import type {
  IMasterScheduleExceptionPublicEntity,
  IMasterScheduleExceptionRelations,
} from 'src/modules/masters/domain/entities/master-schedule-exception';

export interface IGetMasterScheduleExceptionByIdApplicationInput {
  id: string;
  actor: IMasterActorInput;
  params: FindOneParams<
    IMasterScheduleExceptionPublicEntity,
    IMasterScheduleExceptionRelations
  >;
}

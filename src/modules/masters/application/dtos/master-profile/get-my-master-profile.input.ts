import type {
  IMasterProfilePublicEntity,
  IMasterProfileRelations,
} from 'src/modules/masters/domain/entities/master-profile';
import type { FindOneParams } from 'src/modules/shared/domain/query';
import type { IMasterActorInput } from '../common/i-master-actor.input';

export interface IGetMyMasterProfileApplicationInput {
  actor: IMasterActorInput;
  params?: FindOneParams<IMasterProfilePublicEntity, IMasterProfileRelations>;
}

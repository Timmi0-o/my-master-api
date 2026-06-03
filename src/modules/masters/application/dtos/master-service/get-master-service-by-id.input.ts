import type {
  IMasterServicePublicEntity,
  IMasterServiceRelations,
} from 'src/modules/masters/domain/entities/master-service';
import type { FindOneParams } from 'src/modules/shared/domain/query';
import type { IMasterActorInput } from '../common/i-master-actor.input';

export interface IGetMasterServiceByIdApplicationInput {
  id: string;
  actor: IMasterActorInput;
  params?: FindOneParams<IMasterServicePublicEntity, IMasterServiceRelations>;
}

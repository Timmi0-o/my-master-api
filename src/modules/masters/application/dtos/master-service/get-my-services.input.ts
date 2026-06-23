import { FindManyParams } from '@shared/domain/query';
import {
  IMasterServicePublicEntity,
  IMasterServiceRelations,
} from 'src/modules/masters/domain/entities';
import type { IMasterActorInput } from '../common/i-master-actor.input';

export interface IGetMyServicesApplicationInput {
  actor: IMasterActorInput;
  params: FindManyParams<IMasterServicePublicEntity, IMasterServiceRelations>;
}

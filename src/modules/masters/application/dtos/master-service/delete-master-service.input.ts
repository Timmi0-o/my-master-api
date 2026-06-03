import type { IMasterActorInput } from '../common/i-master-actor.input';

export interface IDeleteMasterServiceApplicationInput {
  id: string;
  actor: IMasterActorInput;
}

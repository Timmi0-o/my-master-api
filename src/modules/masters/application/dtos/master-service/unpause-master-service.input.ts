import type { IMasterActorInput } from '../common/i-master-actor.input';

export interface IUnpauseMasterServiceApplicationInput {
  id: string;
  actor: IMasterActorInput;
}

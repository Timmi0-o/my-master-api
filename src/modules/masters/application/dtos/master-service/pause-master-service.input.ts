import type { IMasterActorInput } from '../common/i-master-actor.input';

export interface IPauseMasterServiceApplicationInput {
  id: string;
  actor: IMasterActorInput;
}

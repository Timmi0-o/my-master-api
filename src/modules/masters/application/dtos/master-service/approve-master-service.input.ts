import type { IMasterActorInput } from '../common/i-master-actor.input';

export interface IApproveMasterServiceApplicationInput {
  id: string;
  actor: IMasterActorInput;
}

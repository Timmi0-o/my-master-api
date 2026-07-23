import type { IMasterActorInput } from '../common/i-master-actor.input';

export interface ICreateFavoriteMasterServiceApplicationInput {
  masterServiceId: string;
  actor: IMasterActorInput;
}

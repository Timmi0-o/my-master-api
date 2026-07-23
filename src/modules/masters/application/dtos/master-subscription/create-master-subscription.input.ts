import type { IMasterActorInput } from '../common/i-master-actor.input';

export interface ICreateMasterSubscriptionApplicationInput {
  masterProfileId: string;
  actor: IMasterActorInput;
}

import type { IMasterActorInput } from '../common/i-master-actor.input';

export interface ICreateMasterServiceApplicationInput {
  masterProfileId: string;
  name: string;
  description: string;
  price: number;
  durationMinutes?: number;
  actor: IMasterActorInput;
}

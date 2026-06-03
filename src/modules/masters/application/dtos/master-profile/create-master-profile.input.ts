import type { IMasterActorInput } from '../common/i-master-actor.input';

export interface ICreateMasterProfileApplicationInput {
  displayName: string;
  description: string;
  rating: number;
  userId?: string;
  actor: IMasterActorInput;
}

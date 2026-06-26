import type { IMasterActorInput } from '../common/i-master-actor.input';

export interface ICreateMasterServiceReviewApplicationInput {
  appointmentId: string;
  rating: number;
  text: string;
  actor: IMasterActorInput;
}

import type { EMasterServiceReviewReactionType } from 'src/modules/masters/domain/entities/master-service-review-reaction';
import type { IMasterActorInput } from '../common/i-master-actor.input';

export interface IUpsertMasterServiceReviewReactionApplicationInput {
  masterServiceReviewId: string;
  type: EMasterServiceReviewReactionType;
  actor: IMasterActorInput;
}

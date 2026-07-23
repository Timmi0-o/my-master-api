import type { EMasterServiceReviewReactionType } from './i-master-service-review-reaction.entity';

export interface ICreateMasterServiceReviewReactionInput {
  userId: string;
  masterServiceReviewId: string;
  type: EMasterServiceReviewReactionType;
}

import type { IMasterServiceReviewReactionPublicEntity } from './i-master-service-review-reaction.entity';

export const MASTER_SERVICE_REVIEW_REACTION_SELECT_FIELDS = [
  'id',
  'userId',
  'masterServiceReviewId',
  'type',
  'createdAt',
  'updatedAt',
  'deletedAt',
] as const satisfies readonly (keyof IMasterServiceReviewReactionPublicEntity)[];

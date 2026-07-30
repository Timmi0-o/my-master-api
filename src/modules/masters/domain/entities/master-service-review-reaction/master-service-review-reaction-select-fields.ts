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

export const MASTER_SERVICE_REVIEW_REACTION_STAFF_ONLY_FIELDS = [
  'deletedAt',
] as const satisfies readonly (keyof IMasterServiceReviewReactionPublicEntity)[];

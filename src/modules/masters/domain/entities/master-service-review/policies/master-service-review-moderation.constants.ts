import type { IUpdateMasterServiceReviewInput } from '../i-update-master-service-review.input';

/** Content fields that can harm the community → re-moderation on change. */
export const MASTER_SERVICE_REVIEW_MODERATION_CONTENT_FIELDS = [
  'text',
] as const satisfies readonly (keyof IUpdateMasterServiceReviewInput)[];

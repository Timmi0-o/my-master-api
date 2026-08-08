import type { IUpdateMasterServiceReviewInput } from '../i-update-master-service-review.input';
import { EMasterServiceReviewStatus } from '../master-service-review-status.enum';
import { MASTER_SERVICE_REVIEW_MODERATION_CONTENT_FIELDS } from './master-service-review-moderation.constants';

export function doesMasterServiceReviewUpdateRequireRemoderation(
  patch: IUpdateMasterServiceReviewInput,
): boolean {
  return MASTER_SERVICE_REVIEW_MODERATION_CONTENT_FIELDS.some(
    (field) => patch[field] !== undefined,
  );
}

export function resolveMasterServiceReviewStatusOnUpdate(
  currentStatus: EMasterServiceReviewStatus,
  patch: IUpdateMasterServiceReviewInput,
): EMasterServiceReviewStatus {
  if (currentStatus === EMasterServiceReviewStatus.BLOCKED) {
    return currentStatus;
  }

  if (doesMasterServiceReviewUpdateRequireRemoderation(patch)) {
    return EMasterServiceReviewStatus.REVIEWING;
  }

  return currentStatus;
}

import type { IMasterServiceReviewEntity } from '../i-master-service-review.entity';
import { EMasterServiceReviewStatus } from '../master-service-review-status.enum';

export function isMasterServiceReviewPubliclyVisible(
  review: Pick<IMasterServiceReviewEntity, 'status' | 'deletedAt'>,
): boolean {
  return (
    review.deletedAt == null &&
    review.status === EMasterServiceReviewStatus.ACTIVE
  );
}

export function isMasterServiceReviewVisibleToViewer(
  review: Pick<
    IMasterServiceReviewEntity,
    'status' | 'deletedAt' | 'clientUserId'
  >,
  viewer: { userId?: string; isStaffUser: boolean },
): boolean {
  if (viewer.isStaffUser) {
    return true;
  }

  if (review.deletedAt != null) {
    return false;
  }

  if (review.status === EMasterServiceReviewStatus.ACTIVE) {
    return true;
  }

  return viewer.userId != null && review.clientUserId === viewer.userId;
}

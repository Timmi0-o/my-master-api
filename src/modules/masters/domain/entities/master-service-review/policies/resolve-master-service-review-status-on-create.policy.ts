import { EMasterServiceReviewStatus } from '../master-service-review-status.enum';

export function resolveMasterServiceReviewStatusOnCreate(): EMasterServiceReviewStatus {
  return EMasterServiceReviewStatus.REVIEWING;
}

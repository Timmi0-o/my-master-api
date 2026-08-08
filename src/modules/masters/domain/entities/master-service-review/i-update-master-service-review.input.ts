import type { EMasterServiceReviewStatus } from './master-service-review-status.enum';

export interface IUpdateMasterServiceReviewInput {
  rating?: number;
  text?: string;
  status?: EMasterServiceReviewStatus;
}

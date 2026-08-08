import type { EMasterServiceReviewStatus } from './master-service-review-status.enum';

export interface ICreateMasterServiceReviewInput {
  clientUserId: string;
  masterServiceId: string;
  appointmentId: string;
  rating: number;
  text: string;
  status: EMasterServiceReviewStatus;
}

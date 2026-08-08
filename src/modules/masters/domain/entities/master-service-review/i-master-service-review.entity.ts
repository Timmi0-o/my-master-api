import type { EMasterServiceReviewStatus } from './master-service-review-status.enum';

export interface IMasterServiceReviewEntity {
  id: string;
  clientUserId: string;
  masterServiceId: string;
  appointmentId: string;
  rating: number;
  text: string;
  status: EMasterServiceReviewStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export type IMasterServiceReviewPublicEntity = IMasterServiceReviewEntity;

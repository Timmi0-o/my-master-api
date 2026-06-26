export interface IMasterServiceReviewEntity {
  id: string;
  clientUserId: string;
  masterServiceId: string;
  appointmentId: string;
  rating: number;
  text: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export type IMasterServiceReviewPublicEntity = IMasterServiceReviewEntity;

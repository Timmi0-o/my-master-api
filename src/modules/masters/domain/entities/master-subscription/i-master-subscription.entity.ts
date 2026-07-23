export interface IMasterSubscriptionEntity {
  id: string;
  userId: string;
  masterProfileId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export type IMasterSubscriptionPublicEntity = IMasterSubscriptionEntity;

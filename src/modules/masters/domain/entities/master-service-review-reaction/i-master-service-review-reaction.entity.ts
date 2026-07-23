export enum EMasterServiceReviewReactionType {
  LIKE = 'LIKE',
  DISLIKE = 'DISLIKE',
}

export interface IMasterServiceReviewReactionEntity {
  id: string;
  userId: string;
  masterServiceReviewId: string;
  type: EMasterServiceReviewReactionType;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export type IMasterServiceReviewReactionPublicEntity =
  IMasterServiceReviewReactionEntity;

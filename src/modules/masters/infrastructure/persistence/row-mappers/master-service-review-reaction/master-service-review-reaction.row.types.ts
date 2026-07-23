import type { EMasterServiceReviewReactionType } from 'src/modules/masters/domain/entities/master-service-review-reaction';
import type { MasterServiceReviewRow } from '../master-service-review/master-service-review.row.types';

export type MasterServiceReviewReactionUserRow = {
  id: string;
  username: string;
  name: string;
  surname: string;
  patronymic: string | null;
};

export type MasterServiceReviewReactionRow = {
  id: string;
  userId: string;
  masterServiceReviewId: string;
  type: EMasterServiceReviewReactionType;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  user?: MasterServiceReviewReactionUserRow | null;
  masterServiceReview?: MasterServiceReviewRow | null;
};

import type { IMasterServiceReviewPublicEntity } from '../master-service-review';

export type IMasterServiceReviewReactionUserPublic = {
  id: string;
  username: string;
  name: string;
  surname: string;
  patronymic?: string | null;
};

export interface IMasterServiceReviewReactionRelations {
  user?: IMasterServiceReviewReactionUserPublic;
  masterServiceReview?: IMasterServiceReviewPublicEntity;
}

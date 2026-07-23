import type {
  IMasterServiceReviewReactionPublicEntity,
  IMasterServiceReviewReactionRelations,
} from 'src/modules/masters/domain/entities/master-service-review-reaction';

export type GetMasterServiceReviewReactionsOutput = {
  items: (IMasterServiceReviewReactionPublicEntity &
    Partial<IMasterServiceReviewReactionRelations>)[];
  total: number;
};

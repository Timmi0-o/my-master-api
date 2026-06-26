import type {
  IMasterServiceReviewPublicEntity,
  IMasterServiceReviewRelations,
} from 'src/modules/masters/domain/entities/master-service-review';

export type GetMasterServiceReviewsOutput = {
  items: (IMasterServiceReviewPublicEntity &
    Partial<IMasterServiceReviewRelations>)[];
  total: number;
};

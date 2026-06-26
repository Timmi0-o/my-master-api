import type {
  IMasterServiceReviewPublicEntity,
  IMasterServiceReviewRelations,
} from 'src/modules/masters/domain/entities/master-service-review';

export type IGetMasterServiceReviewByIdApplicationOutput =
  IMasterServiceReviewPublicEntity & Partial<IMasterServiceReviewRelations>;

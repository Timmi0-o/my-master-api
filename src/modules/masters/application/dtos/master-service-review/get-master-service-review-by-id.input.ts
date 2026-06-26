import type { FindOneParams } from 'src/modules/shared/domain/query';
import type {
  IMasterServiceReviewPublicEntity,
  IMasterServiceReviewRelations,
} from 'src/modules/masters/domain/entities/master-service-review';

export interface IGetMasterServiceReviewByIdApplicationInput {
  id: string;
  isStaffUser: boolean;
  params: FindOneParams<
    IMasterServiceReviewPublicEntity,
    IMasterServiceReviewRelations
  >;
}

import type { WhereFilter } from 'src/modules/shared/domain/query';
import type { IMasterServiceReviewPublicEntity } from '../i-master-service-review.entity';
import type { IMasterServiceReviewRelations } from '../i-master-service-review-relations';
import { EMasterServiceReviewStatus } from '../master-service-review-status.enum';

export const MASTER_SERVICE_REVIEW_ACTIVE_STATUS_WHERE: WhereFilter<
  IMasterServiceReviewPublicEntity,
  IMasterServiceReviewRelations
> = {
  status: { eq: EMasterServiceReviewStatus.ACTIVE },
};

export function buildMasterServiceReviewViewerVisibilityWhere(
  viewerUserId: string | undefined,
): WhereFilter<
  IMasterServiceReviewPublicEntity,
  IMasterServiceReviewRelations
> {
  if (!viewerUserId) {
    return MASTER_SERVICE_REVIEW_ACTIVE_STATUS_WHERE;
  }

  return {
    or: [
      MASTER_SERVICE_REVIEW_ACTIVE_STATUS_WHERE,
      { clientUserId: { eq: viewerUserId } },
    ],
  };
}

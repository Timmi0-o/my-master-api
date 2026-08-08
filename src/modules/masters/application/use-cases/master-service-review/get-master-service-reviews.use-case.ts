import { enrichReactionStatsWithReviews } from 'src/modules/masters/application/helpers/enrich-reaction-stats-with-reviews';
import {
  buildMasterServiceReviewViewerVisibilityWhere,
  type IMasterServiceReviewPublicEntity,
  type IMasterServiceReviewRelations,
} from 'src/modules/masters/domain/entities/master-service-review';
import type { IMasterServiceReviewReactionRepository } from 'src/modules/masters/domain/repositories/master-service-review-reaction/i-master-service-review-reaction.repository';
import type { IMasterServiceReviewRepository } from 'src/modules/masters/domain/repositories/master-service-review/i-master-service-review.repository';
import { applyReadEnrichments } from 'src/modules/shared/application/enrichment/apply-read-enrichments';
import { mergeWhereFilters } from 'src/modules/shared/application/presets/common/query-filter.helper';
import type { FindManyParams } from 'src/modules/shared/domain/query';
import type { GetMasterServiceReviewsOutput } from '../../dtos/master-service-review/get-master-service-reviews.output';

export type IGetMasterServiceReviewsApplicationInput = FindManyParams<
  IMasterServiceReviewPublicEntity,
  IMasterServiceReviewRelations
> & {
  isStaffUser: boolean;
  viewerUserId?: string;
};

export class GetMasterServiceReviewsUseCase {
  constructor(
    private readonly masterServiceReviewRepository: IMasterServiceReviewRepository,
    private readonly masterServiceReviewReactionRepository: IMasterServiceReviewReactionRepository,
  ) {}

  async execute(
    params: IGetMasterServiceReviewsApplicationInput,
  ): Promise<GetMasterServiceReviewsOutput> {
    const where = params.isStaffUser
      ? params.where
      : mergeWhereFilters(
          params.where,
          buildMasterServiceReviewViewerVisibilityWhere(params.viewerUserId),
        );

    const filteredParams = { ...params, where };

    const [items, total] = await Promise.all([
      this.masterServiceReviewRepository.findMany(filteredParams),
      this.masterServiceReviewRepository.count({ where }),
    ]);

    const enriched = await applyReadEnrichments(items, {}, [
      {
        when: () => true,
        apply: async (current) => {
          const stats =
            await this.masterServiceReviewReactionRepository.getStatsByReviewIds(
              current.map((item) => item.id),
            );
          return enrichReactionStatsWithReviews(current, stats);
        },
      },
    ]);

    return { items: enriched, total };
  }
}

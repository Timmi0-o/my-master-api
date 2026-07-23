import type {
  IMasterServiceReviewPublicEntity,
  IMasterServiceReviewRelations,
} from 'src/modules/masters/domain/entities/master-service-review';
import type { MasterServiceReviewReactionStats } from 'src/modules/masters/domain/repositories/master-service-review-reaction/i-master-service-review-reaction.repository';

export type IMasterServiceReviewWithReactionStats =
  IMasterServiceReviewPublicEntity &
    Partial<IMasterServiceReviewRelations> & {
      likesCount: number;
      dislikesCount: number;
    };

export function attachReactionStatsToReviews<
  T extends IMasterServiceReviewPublicEntity &
    Partial<IMasterServiceReviewRelations>,
>(
  items: T[],
  stats: Map<string, MasterServiceReviewReactionStats>,
): IMasterServiceReviewWithReactionStats[] {
  return items.map((item) => {
    const itemStats = stats.get(item.id);
    return {
      ...item,
      likesCount: itemStats?.likesCount ?? 0,
      dislikesCount: itemStats?.dislikesCount ?? 0,
    };
  });
}

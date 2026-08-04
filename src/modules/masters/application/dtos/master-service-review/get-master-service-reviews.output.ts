import type { IMasterServiceReviewWithReactionStats } from 'src/modules/masters/application/helpers/enrich-reaction-stats-with-reviews';

export type GetMasterServiceReviewsOutput = {
  items: IMasterServiceReviewWithReactionStats[];
  total: number;
};

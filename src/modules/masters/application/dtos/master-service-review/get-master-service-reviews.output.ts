import type { IMasterServiceReviewWithReactionStats } from 'src/modules/masters/application/helpers/attach-reaction-stats-to-reviews';

export type GetMasterServiceReviewsOutput = {
  items: IMasterServiceReviewWithReactionStats[];
  total: number;
};

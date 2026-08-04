import type { EMasterServiceCategory } from 'src/modules/masters/domain/entities/master-service';
import {
  FEED_INTERACTION_RECENCY_BOOST,
  FEED_MAX_SERVICE_RATING,
  FEED_SCORE_WEIGHTS,
} from './feed-ranking.constants';
import type { UserInterestProfile } from './build-user-interest-profile.policy';

export type ScoreableService = {
  id: string;
  category: EMasterServiceCategory;
  tags: string[];
  rating: number;
  masterProfileId: string;
};

function maxMapValue(
  map: Map<string, number> | Map<EMasterServiceCategory, number>,
): number {
  let max = 0;
  for (const value of map.values()) {
    if (value > max) max = value;
  }
  return max || 1;
}

export function scoreFeedService(
  service: ScoreableService,
  profile: UserInterestProfile,
): number {
  const categoryMax = maxMapValue(profile.categoryWeights);
  const tagMax = maxMapValue(profile.tagWeights);

  const categoryMatch =
    (profile.categoryWeights.get(service.category) ?? 0) / categoryMax;

  let tagOverlap = 0;
  if (service.tags.length > 0 && profile.tagWeights.size > 0) {
    let sum = 0;
    for (const tag of service.tags) {
      sum += profile.tagWeights.get(tag.trim().toLowerCase()) ?? 0;
    }
    tagOverlap = Math.min(1, sum / tagMax);
  }

  const normalizedRating = Math.min(
    1,
    Math.max(0, service.rating / FEED_MAX_SERVICE_RATING),
  );

  const subscriptionBoost = profile.subscribedMasterProfileIds.has(
    service.masterProfileId,
  )
    ? 1
    : 0;

  const recencyBoost = profile.interactedServiceIds.has(service.id)
    ? FEED_INTERACTION_RECENCY_BOOST
    : 0;

  return (
    FEED_SCORE_WEIGHTS.category * categoryMatch +
    FEED_SCORE_WEIGHTS.tag * tagOverlap +
    FEED_SCORE_WEIGHTS.rating * normalizedRating +
    FEED_SCORE_WEIGHTS.subscription * subscriptionBoost +
    FEED_SCORE_WEIGHTS.recency * recencyBoost
  );
}

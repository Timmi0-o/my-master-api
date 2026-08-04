import type { FeedSignalKind } from '../i-feed-interest-signal';

/** Base weight of each interest signal before time decay. */
export const FEED_SIGNAL_BASE_WEIGHT: Record<FeedSignalKind, number> = {
  appointment: 5,
  favorite: 4,
  subscription: 2.5,
  click: 2,
  view: 1,
};

/** Exponential decay half-life for interest signals (days). */
export const FEED_SIGNAL_HALF_LIFE_DAYS = 45;

export const FEED_MS_PER_DAY = 24 * 60 * 60 * 1000;

/** How far back to load signals for the interest profile. */
export const FEED_SIGNAL_LOOKBACK_DAYS = 90;

/** Exclude services booked this recently from the ranked feed. */
export const FEED_RECENT_BOOKED_EXCLUDE_DAYS = 14;

/**
 * Profiles with total signal weight below this use rating cold-start.
 */
export const FEED_COLD_START_MAX_TOTAL_WEIGHT = 2;

/** Max discoverable candidates to score before pagination. */
export const FEED_CANDIDATE_LIMIT = 100;

/** Relative contribution of each score feature (should sum to ~1). */
export const FEED_SCORE_WEIGHTS = {
  category: 0.4,
  tag: 0.2,
  rating: 0.2,
  subscription: 0.1,
  recency: 0.1,
} as const;

/** Soft boost when the user already interacted with the candidate service. */
export const FEED_INTERACTION_RECENCY_BOOST = 0.3;

/** Rating scale upper bound used for normalization. */
export const FEED_MAX_SERVICE_RATING = 5;

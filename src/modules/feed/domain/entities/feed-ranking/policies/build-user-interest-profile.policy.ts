import type { EMasterServiceCategory } from 'src/modules/masters/domain/entities/master-service';
import type {
  FeedInterestSignal,
  FeedSignalKind,
} from '../i-feed-interest-signal';
import {
  FEED_COLD_START_MAX_TOTAL_WEIGHT,
  FEED_MS_PER_DAY,
  FEED_RECENT_BOOKED_EXCLUDE_DAYS,
  FEED_SIGNAL_BASE_WEIGHT,
  FEED_SIGNAL_HALF_LIFE_DAYS,
} from './feed-ranking.constants';

export type { FeedInterestSignal, FeedSignalKind };

export type UserInterestProfile = {
  categoryWeights: Map<EMasterServiceCategory, number>;
  tagWeights: Map<string, number>;
  subscribedMasterProfileIds: Set<string>;
  interactedServiceIds: Set<string>;
  recentBookedServiceIds: Set<string>;
  totalWeight: number;
};

export function decayWeight(at: Date, now: Date): number {
  const daysAgo = Math.max(0, (now.getTime() - at.getTime()) / FEED_MS_PER_DAY);
  return Math.pow(0.5, daysAgo / FEED_SIGNAL_HALF_LIFE_DAYS);
}

export function buildUserInterestProfile(
  signals: FeedInterestSignal[],
  now = new Date(),
): UserInterestProfile {
  const categoryWeights = new Map<EMasterServiceCategory, number>();
  const tagWeights = new Map<string, number>();
  const subscribedMasterProfileIds = new Set<string>();
  const interactedServiceIds = new Set<string>();
  const recentBookedServiceIds = new Set<string>();
  let totalWeight = 0;

  for (const signal of signals) {
    const weight =
      FEED_SIGNAL_BASE_WEIGHT[signal.kind] * decayWeight(signal.at, now);
    totalWeight += weight;

    if (signal.kind === 'subscription' && signal.masterProfileId) {
      subscribedMasterProfileIds.add(signal.masterProfileId);
    }

    if (signal.masterServiceId) {
      interactedServiceIds.add(signal.masterServiceId);
      if (signal.kind === 'appointment') {
        const daysAgo = (now.getTime() - signal.at.getTime()) / FEED_MS_PER_DAY;
        if (daysAgo <= FEED_RECENT_BOOKED_EXCLUDE_DAYS) {
          recentBookedServiceIds.add(signal.masterServiceId);
        }
      }
    }

    if (signal.kind === 'subscription') {
      continue;
    }

    categoryWeights.set(
      signal.category,
      (categoryWeights.get(signal.category) ?? 0) + weight,
    );

    for (const tag of signal.tags) {
      const normalized = tag.trim().toLowerCase();
      if (!normalized) continue;
      tagWeights.set(normalized, (tagWeights.get(normalized) ?? 0) + weight);
    }
  }

  return {
    categoryWeights,
    tagWeights,
    subscribedMasterProfileIds,
    interactedServiceIds,
    recentBookedServiceIds,
    totalWeight,
  };
}

export function isColdStart(profile: UserInterestProfile): boolean {
  return profile.totalWeight < FEED_COLD_START_MAX_TOTAL_WEIGHT;
}

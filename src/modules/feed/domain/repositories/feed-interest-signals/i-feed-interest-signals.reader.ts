import type { FeedInterestSignal } from '../../entities/feed-ranking';

export interface IFeedInterestSignalsReader {
  loadSignals(userId: string): Promise<FeedInterestSignal[]>;
}

export const FEED_INTEREST_SIGNALS_READER_TOKEN = Symbol(
  'FEED_INTEREST_SIGNALS_READER',
);

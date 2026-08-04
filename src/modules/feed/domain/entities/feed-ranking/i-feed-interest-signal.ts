import type { EMasterServiceCategory } from 'src/modules/masters/domain/entities/master-service';

export type FeedSignalKind =
  | 'appointment'
  | 'favorite'
  | 'subscription'
  | 'click'
  | 'view';

export type FeedInterestSignal = {
  kind: FeedSignalKind;
  category: EMasterServiceCategory;
  tags: string[];
  masterProfileId?: string;
  masterServiceId?: string;
  at: Date;
};

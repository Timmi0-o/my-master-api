import type { EUserServiceInteractionType } from '../../domain/entities/user-service-interaction';

export type IRecordFeedEventItem = {
  masterServiceId: string;
  type: EUserServiceInteractionType;
};

export type IRecordFeedEventsApplicationInput = {
  userId: string;
  events: IRecordFeedEventItem[];
};

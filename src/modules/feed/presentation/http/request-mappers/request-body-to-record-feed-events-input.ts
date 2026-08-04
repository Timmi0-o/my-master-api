import { EUserServiceInteractionType } from 'src/modules/feed/domain/entities/user-service-interaction';
import type { IRecordFeedEventsApplicationInput } from 'src/modules/feed/application/dtos/i-record-feed-events-input.dto';
import type { IRecordFeedEventsPayload } from '../validation/schemas/record-feed-events-payload.types';

export function requestBodyToRecordFeedEventsInput(
  payload: IRecordFeedEventsPayload,
  userId: string,
): IRecordFeedEventsApplicationInput {
  return {
    userId,
    events: payload.events.map((event) => ({
      masterServiceId: event.masterServiceId,
      type:
        event.type === 'CLICK'
          ? EUserServiceInteractionType.CLICK
          : EUserServiceInteractionType.VIEW,
    })),
  };
}

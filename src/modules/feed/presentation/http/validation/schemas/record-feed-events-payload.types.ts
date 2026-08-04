export type IRecordFeedEventPayloadItem = {
  masterServiceId: string;
  type: 'VIEW' | 'CLICK';
};

export type IRecordFeedEventsPayload = {
  events: IRecordFeedEventPayloadItem[];
};

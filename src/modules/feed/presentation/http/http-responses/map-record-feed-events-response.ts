import type { IRecordFeedEventsApplicationOutput } from 'src/modules/feed/application/dtos/i-record-feed-events-output.dto';

export function mapRecordFeedEventsHttpResponse(
  output: IRecordFeedEventsApplicationOutput,
) {
  return {
    accepted: output.accepted,
    skipped: output.skipped,
  };
}

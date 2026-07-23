import type { IUpsertMasterServiceReviewReactionApplicationOutput } from 'src/modules/masters/application/dtos/master-service-review-reaction/upsert-master-service-review-reaction.output';
import { mapMasterServiceReviewReactionHttpResponse } from './map-master-service-review-reaction-http-response';

export function mapUpsertMasterServiceReviewReactionHttpResponse(
  output: IUpsertMasterServiceReviewReactionApplicationOutput,
) {
  if (!output) {
    return { data: null };
  }

  return mapMasterServiceReviewReactionHttpResponse(output);
}

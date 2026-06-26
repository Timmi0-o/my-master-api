import type { IUpdateMasterServiceReviewApplicationOutput } from 'src/modules/masters/application/dtos/master-service-review/update-master-service-review.output';
import { mapMasterServiceReviewHttpResponse } from './map-master-service-review-http-response';

export function mapUpdateMasterServiceReviewHttpResponse(
  output: IUpdateMasterServiceReviewApplicationOutput,
) {
  return mapMasterServiceReviewHttpResponse(output);
}

import type { ICreateMasterServiceReviewApplicationOutput } from 'src/modules/masters/application/dtos/master-service-review/create-master-service-review.output';
import { mapMasterServiceReviewHttpResponse } from './map-master-service-review-http-response';

export function mapCreateMasterServiceReviewHttpResponse(
  output: ICreateMasterServiceReviewApplicationOutput,
) {
  return mapMasterServiceReviewHttpResponse(output);
}

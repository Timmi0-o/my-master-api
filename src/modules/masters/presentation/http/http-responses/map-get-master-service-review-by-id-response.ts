import type { IGetMasterServiceReviewByIdApplicationOutput } from 'src/modules/masters/application/dtos/master-service-review/get-master-service-review-by-id.output';
import { mapMasterServiceReviewHttpResponse } from './map-master-service-review-http-response';

export function mapGetMasterServiceReviewByIdHttpResponse(
  output: IGetMasterServiceReviewByIdApplicationOutput,
) {
  return mapMasterServiceReviewHttpResponse(output);
}

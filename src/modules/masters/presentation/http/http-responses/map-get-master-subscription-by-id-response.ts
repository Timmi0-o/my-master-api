import type { IGetMasterSubscriptionByIdApplicationOutput } from 'src/modules/masters/application/dtos/master-subscription/get-master-subscription-by-id.output';
import { mapMasterSubscriptionHttpResponse } from './map-master-subscription-http-response';

export function mapGetMasterSubscriptionByIdHttpResponse(
  output: IGetMasterSubscriptionByIdApplicationOutput,
) {
  return mapMasterSubscriptionHttpResponse(output);
}

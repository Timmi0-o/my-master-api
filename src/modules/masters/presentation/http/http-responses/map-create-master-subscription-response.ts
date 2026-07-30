import type { ICreateMasterSubscriptionApplicationOutput } from 'src/modules/masters/application/dtos/master-subscription/create-master-subscription.output';
import { mapMasterSubscriptionHttpResponse } from './map-master-subscription-http-response';

export function mapCreateMasterSubscriptionHttpResponse(
  output: ICreateMasterSubscriptionApplicationOutput,
) {
  return mapMasterSubscriptionHttpResponse(output);
}

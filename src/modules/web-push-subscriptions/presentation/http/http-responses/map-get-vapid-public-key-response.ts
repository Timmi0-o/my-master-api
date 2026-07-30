import type { IGetVapidPublicKeyApplicationOutput } from 'src/modules/web-push-subscriptions/application/dtos/web-push-subscription/get-vapid-public-key.output';
import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/http-responses/map-entity-http-response';

export function mapGetVapidPublicKeyHttpResponse(
  output: IGetVapidPublicKeyApplicationOutput,
) {
  return mapEntityHttpResponse(output);
}

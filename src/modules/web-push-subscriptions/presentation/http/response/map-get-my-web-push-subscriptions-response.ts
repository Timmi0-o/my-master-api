import type { IGetMyWebPushSubscriptionsApplicationOutput } from 'src/modules/web-push-subscriptions/application/dtos/web-push-subscription/get-my-web-push-subscriptions.output';

export function mapGetMyWebPushSubscriptionsHttpResponse(
  output: IGetMyWebPushSubscriptionsApplicationOutput,
) {
  return { data: output.items };
}

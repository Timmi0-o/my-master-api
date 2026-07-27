import type { IWebPushSubscriptionRepository } from 'src/modules/web-push-subscriptions/domain/repositories/web-push-subscription';
import type { IGetMyWebPushSubscriptionsApplicationInput } from '../../dtos/web-push-subscription/get-my-web-push-subscriptions.input';
import type { IGetMyWebPushSubscriptionsApplicationOutput } from '../../dtos/web-push-subscription/get-my-web-push-subscriptions.output';
import { toWebPushSubscriptionPublicEntity } from '../../dtos/web-push-subscription/to-web-push-subscription-public-entity';

export class GetMyWebPushSubscriptionsUseCase {
  constructor(
    private readonly webPushSubscriptionRepository: IWebPushSubscriptionRepository,
  ) {}

  async execute(
    input: IGetMyWebPushSubscriptionsApplicationInput,
  ): Promise<IGetMyWebPushSubscriptionsApplicationOutput> {
    const items = await this.webPushSubscriptionRepository.findManyByUserId(
      input.actor.userId,
    );

    return {
      items: items.map(toWebPushSubscriptionPublicEntity),
    };
  }
}

import type { ITransactionManager } from '@shared/domain/transactions';
import {
  WebPushSubscriptionStatus,
  type ICreateWebPushSubscriptionInput,
  type IUpdateWebPushSubscriptionInput,
} from 'src/modules/web-push-subscriptions/domain/entities/web-push-subscription';
import type { IWebPushSubscriptionRepository } from 'src/modules/web-push-subscriptions/domain/repositories/web-push-subscription';
import { toWebPushSubscriptionPublicEntity } from '../../dtos/web-push-subscription/to-web-push-subscription-public-entity';
import type { IUpsertWebPushSubscriptionApplicationInput } from '../../dtos/web-push-subscription/upsert-web-push-subscription.input';
import type { IUpsertWebPushSubscriptionApplicationOutput } from '../../dtos/web-push-subscription/upsert-web-push-subscription.output';

export class UpsertWebPushSubscriptionUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly webPushSubscriptionRepository: IWebPushSubscriptionRepository,
  ) {}

  async execute(
    input: IUpsertWebPushSubscriptionApplicationInput,
  ): Promise<IUpsertWebPushSubscriptionApplicationOutput> {
    const expirationTime =
      input.expirationTime == null ? null : new Date(input.expirationTime);

    const entity = await this.transactionManager.runInTransaction(
      async (scope) => {
        const existing =
          await this.webPushSubscriptionRepository.findEntityByEndpoint(
            input.endpoint,
            scope,
          );

        if (!existing) {
          const createInput: ICreateWebPushSubscriptionInput = {
            userId: input.actor.userId,
            endpoint: input.endpoint,
            p256dh: input.p256dh,
            auth: input.auth,
            expirationTime,
            contentEncoding: input.contentEncoding,
            userAgent: input.userAgent,
            deviceType: input.deviceType,
            browser: input.browser,
            platform: input.platform,
          };

          return this.webPushSubscriptionRepository.create(createInput, scope);
        }

        const updateInput: IUpdateWebPushSubscriptionInput = {
          userId: input.actor.userId,
          p256dh: input.p256dh,
          auth: input.auth,
          expirationTime,
          contentEncoding: input.contentEncoding,
          userAgent: input.userAgent,
          deviceType: input.deviceType,
          browser: input.browser,
          platform: input.platform,
          status: WebPushSubscriptionStatus.ACTIVE,
          clearDeletedAt: true,
          resetDeliveryState: true,
        };

        return this.webPushSubscriptionRepository.update(
          existing.id,
          updateInput,
          scope,
        );
      },
    );

    return toWebPushSubscriptionPublicEntity(entity);
  }
}

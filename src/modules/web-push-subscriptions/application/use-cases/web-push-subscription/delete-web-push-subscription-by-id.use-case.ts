import type { ITransactionManager } from '@shared/domain/transactions';
import {
  ensureWebPushSubscriptionExists,
  ensureWebPushSubscriptionModifiable,
} from 'src/modules/web-push-subscriptions/domain/entities/web-push-subscription';
import type { IWebPushSubscriptionRepository } from 'src/modules/web-push-subscriptions/domain/repositories/web-push-subscription';
import type { IDeleteWebPushSubscriptionApplicationInput } from '../../dtos/web-push-subscription/delete-web-push-subscription.input';
import type { IDeleteWebPushSubscriptionApplicationOutput } from '../../dtos/web-push-subscription/delete-web-push-subscription.output';

export class DeleteWebPushSubscriptionByIdUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly webPushSubscriptionRepository: IWebPushSubscriptionRepository,
  ) {}

  async execute(
    input: IDeleteWebPushSubscriptionApplicationInput,
  ): Promise<IDeleteWebPushSubscriptionApplicationOutput> {
    const existing = await this.webPushSubscriptionRepository.findEntityById(
      input.id,
    );
    ensureWebPushSubscriptionExists(existing, input.id);
    ensureWebPushSubscriptionModifiable(existing, input.actor);

    await this.transactionManager.runInTransaction((scope) =>
      this.webPushSubscriptionRepository.softDelete(input.id, scope),
    );
  }
}

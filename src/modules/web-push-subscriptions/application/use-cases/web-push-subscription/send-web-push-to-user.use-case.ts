import type { IWebPushSender } from '@modules/web-push-subscriptions/infrastructure/services/push/i-web-push-sender';
import type { ILogger } from '@shared/domain/logging/logger.token';
import type { IWebPushSubscriptionRepository } from 'src/modules/web-push-subscriptions/domain/repositories/web-push-subscription';
import type { ISendWebPushToUserApplicationInput } from '../../dtos/web-push-subscription/send-web-push-to-user.input';
import type { ISendWebPushToUserApplicationOutput } from '../../dtos/web-push-subscription/send-web-push-to-user.output';

export class SendWebPushToUserUseCase {
  constructor(
    private readonly webPushSubscriptionRepository: IWebPushSubscriptionRepository,
    private readonly webPushSender: IWebPushSender,
    private readonly logger: ILogger,
  ) {}

  async execute(
    input: ISendWebPushToUserApplicationInput,
  ): Promise<ISendWebPushToUserApplicationOutput> {
    const empty: ISendWebPushToUserApplicationOutput = {
      attempted: 0,
      succeeded: 0,
      failed: 0,
      expired: 0,
    };

    try {
      if (!this.webPushSender.isConfigured()) {
        this.logger.warn(
          'Skip web push: VAPID is not configured',
          'SendWebPushToUserUseCase',
        );
        return empty;
      }

      const subscriptions =
        await this.webPushSubscriptionRepository.findActiveByUserId(
          input.userId,
        );

      if (subscriptions.length === 0) {
        return empty;
      }

      let succeeded = 0;
      let failed = 0;
      let expired = 0;

      await Promise.all(
        subscriptions.map(async (subscription) => {
          const result = await this.webPushSender.send(
            {
              endpoint: subscription.endpoint,
              p256dh: subscription.p256dh,
              auth: subscription.auth,
              contentEncoding: subscription.contentEncoding,
            },
            {
              title: input.title,
              body: input.body,
              data: input.data,
            },
          );

          if (result.ok) {
            succeeded += 1;
            await this.webPushSubscriptionRepository.recordDeliverySuccess(
              subscription.id,
            );
            return;
          }

          if (result.expired) {
            expired += 1;
            await this.webPushSubscriptionRepository.markExpired(
              subscription.id,
              result.statusCode,
            );
            return;
          }

          failed += 1;
          await this.webPushSubscriptionRepository.recordDeliveryFailure(
            subscription.id,
            result.statusCode,
          );
          this.logger.warn(
            `Web push failed for subscription ${subscription.id}: ${result.message}`,
            'SendWebPushToUserUseCase',
          );
        }),
      );

      return {
        attempted: subscriptions.length,
        succeeded,
        failed,
        expired,
      };
    } catch (error) {
      this.logger.error(
        error instanceof Error
          ? error.message
          : 'Unexpected web push send error',
        'SendWebPushToUserUseCase',
      );
      return empty;
    }
  }
}

import { Module } from '@nestjs/common';
import {
  LOGGER_TOKEN,
  type ILogger,
} from '@shared/domain/logging/logger.token';
import {
  TRANSACTION_MANAGER_TOKEN,
  type ITransactionManager,
} from '@shared/domain/transactions';
import { DeleteWebPushSubscriptionByIdUseCase } from 'src/modules/web-push-subscriptions/application/use-cases/web-push-subscription/delete-web-push-subscription-by-id.use-case';
import { GetMyWebPushSubscriptionsUseCase } from 'src/modules/web-push-subscriptions/application/use-cases/web-push-subscription/get-my-web-push-subscriptions.use-case';
import { GetVapidPublicKeyUseCase } from 'src/modules/web-push-subscriptions/application/use-cases/web-push-subscription/get-vapid-public-key.use-case';
import { SendWebPushToUserUseCase } from 'src/modules/web-push-subscriptions/application/use-cases/web-push-subscription/send-web-push-to-user.use-case';
import { UpsertWebPushSubscriptionUseCase } from 'src/modules/web-push-subscriptions/application/use-cases/web-push-subscription/upsert-web-push-subscription.use-case';
import {
  WEB_PUSH_SUBSCRIPTION_REPOSITORY_TOKEN,
  type IWebPushSubscriptionRepository,
} from 'src/modules/web-push-subscriptions/domain/repositories/web-push-subscription';
import { PrismaWebPushSubscriptionRepository } from '../../persistence/repositories/web-push-subscription/prisma-web-push-subscription.repository';
import {
  WEB_PUSH_SENDER_TOKEN,
  type IWebPushSender,
} from '../../services/push/i-web-push-sender';
import { WebPushSender } from '../../services/push/web-push-sender.service';

@Module({
  providers: [
    {
      provide: WEB_PUSH_SUBSCRIPTION_REPOSITORY_TOKEN,
      useClass: PrismaWebPushSubscriptionRepository,
    },
    {
      provide: WEB_PUSH_SENDER_TOKEN,
      useClass: WebPushSender,
    },
    {
      provide: UpsertWebPushSubscriptionUseCase,
      useFactory: (
        transactionManager: ITransactionManager,
        repo: IWebPushSubscriptionRepository,
      ) => new UpsertWebPushSubscriptionUseCase(transactionManager, repo),
      inject: [
        TRANSACTION_MANAGER_TOKEN,
        WEB_PUSH_SUBSCRIPTION_REPOSITORY_TOKEN,
      ],
    },
    {
      provide: DeleteWebPushSubscriptionByIdUseCase,
      useFactory: (
        transactionManager: ITransactionManager,
        repo: IWebPushSubscriptionRepository,
      ) => new DeleteWebPushSubscriptionByIdUseCase(transactionManager, repo),
      inject: [
        TRANSACTION_MANAGER_TOKEN,
        WEB_PUSH_SUBSCRIPTION_REPOSITORY_TOKEN,
      ],
    },
    {
      provide: GetMyWebPushSubscriptionsUseCase,
      useFactory: (repo: IWebPushSubscriptionRepository) =>
        new GetMyWebPushSubscriptionsUseCase(repo),
      inject: [WEB_PUSH_SUBSCRIPTION_REPOSITORY_TOKEN],
    },
    {
      provide: GetVapidPublicKeyUseCase,
      useFactory: (sender: IWebPushSender) =>
        new GetVapidPublicKeyUseCase(sender.getPublicKey()),
      inject: [WEB_PUSH_SENDER_TOKEN],
    },
    {
      provide: SendWebPushToUserUseCase,
      useFactory: (
        repo: IWebPushSubscriptionRepository,
        sender: IWebPushSender,
        logger: ILogger,
      ) => new SendWebPushToUserUseCase(repo, sender, logger),
      inject: [
        WEB_PUSH_SUBSCRIPTION_REPOSITORY_TOKEN,
        WEB_PUSH_SENDER_TOKEN,
        LOGGER_TOKEN,
      ],
    },
  ],
  exports: [
    WEB_PUSH_SUBSCRIPTION_REPOSITORY_TOKEN,
    UpsertWebPushSubscriptionUseCase,
    DeleteWebPushSubscriptionByIdUseCase,
    GetMyWebPushSubscriptionsUseCase,
    GetVapidPublicKeyUseCase,
    SendWebPushToUserUseCase,
  ],
})
export class WebPushSubscriptionModule {}

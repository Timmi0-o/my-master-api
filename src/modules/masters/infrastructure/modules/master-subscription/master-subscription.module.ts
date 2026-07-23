import { Module } from '@nestjs/common';
import { TRANSACTION_MANAGER_TOKEN } from '@shared/domain/transactions';
import type { ITransactionManager } from '@shared/domain/transactions';
import { CreateMasterSubscriptionUseCase } from '../../../application/use-cases/master-subscription/create-master-subscription.use-case';
import { DeleteMasterSubscriptionByIdUseCase } from '../../../application/use-cases/master-subscription/delete-master-subscription-by-id.use-case';
import { GetMasterSubscriptionByIdUseCase } from '../../../application/use-cases/master-subscription/get-master-subscription-by-id.use-case';
import { GetMasterSubscriptionsUseCase } from '../../../application/use-cases/master-subscription/get-master-subscriptions.use-case';
import type { IMasterProfileRepository } from '../../../domain/repositories/master-profile/i-master-profile.repository';
import { MASTER_PROFILE_REPOSITORY_TOKEN } from '../../../domain/repositories/master-profile/master-profile.repository.tokens';
import type { IMasterSubscriptionRepository } from '../../../domain/repositories/master-subscription/i-master-subscription.repository';
import { MASTER_SUBSCRIPTION_REPOSITORY_TOKEN } from '../../../domain/repositories/master-subscription/master-subscription.repository.tokens';
import { PrismaMasterSubscriptionRepository } from '../../persistence/repositories/master-subscription/prisma-master-subscription.repository';
import { MasterProfileModule } from '../master-profile/master-profile.module';

@Module({
  imports: [MasterProfileModule],
  providers: [
    {
      provide: MASTER_SUBSCRIPTION_REPOSITORY_TOKEN,
      useClass: PrismaMasterSubscriptionRepository,
    },
    {
      provide: GetMasterSubscriptionsUseCase,
      useFactory: (repo: IMasterSubscriptionRepository) =>
        new GetMasterSubscriptionsUseCase(repo),
      inject: [MASTER_SUBSCRIPTION_REPOSITORY_TOKEN],
    },
    {
      provide: GetMasterSubscriptionByIdUseCase,
      useFactory: (repo: IMasterSubscriptionRepository) =>
        new GetMasterSubscriptionByIdUseCase(repo),
      inject: [MASTER_SUBSCRIPTION_REPOSITORY_TOKEN],
    },
    {
      provide: CreateMasterSubscriptionUseCase,
      useFactory: (
        transactionManager: ITransactionManager,
        subscriptionRepo: IMasterSubscriptionRepository,
        profileRepo: IMasterProfileRepository,
      ) =>
        new CreateMasterSubscriptionUseCase(
          transactionManager,
          subscriptionRepo,
          profileRepo,
        ),
      inject: [
        TRANSACTION_MANAGER_TOKEN,
        MASTER_SUBSCRIPTION_REPOSITORY_TOKEN,
        MASTER_PROFILE_REPOSITORY_TOKEN,
      ],
    },
    {
      provide: DeleteMasterSubscriptionByIdUseCase,
      useFactory: (
        transactionManager: ITransactionManager,
        subscriptionRepo: IMasterSubscriptionRepository,
      ) =>
        new DeleteMasterSubscriptionByIdUseCase(
          transactionManager,
          subscriptionRepo,
        ),
      inject: [TRANSACTION_MANAGER_TOKEN, MASTER_SUBSCRIPTION_REPOSITORY_TOKEN],
    },
  ],
  exports: [
    MASTER_SUBSCRIPTION_REPOSITORY_TOKEN,
    GetMasterSubscriptionsUseCase,
    GetMasterSubscriptionByIdUseCase,
    CreateMasterSubscriptionUseCase,
    DeleteMasterSubscriptionByIdUseCase,
  ],
})
export class MasterSubscriptionModule {}

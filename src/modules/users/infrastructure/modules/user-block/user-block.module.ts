import { Module, forwardRef } from '@nestjs/common';
import { TRANSACTION_MANAGER_TOKEN } from '@shared/domain/transactions';
import type { ITransactionManager } from '@shared/domain/transactions';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import { MASTER_PROFILE_REPOSITORY_TOKEN } from 'src/modules/masters/domain/repositories/master-profile/master-profile.repository.tokens';
import type { IMasterSubscriptionRepository } from 'src/modules/masters/domain/repositories/master-subscription/i-master-subscription.repository';
import { MASTER_SUBSCRIPTION_REPOSITORY_TOKEN } from 'src/modules/masters/domain/repositories/master-subscription/master-subscription.repository.tokens';
import { MasterProfileModule } from 'src/modules/masters/infrastructure/modules/master-profile/master-profile.module';
import { MasterSubscriptionModule } from 'src/modules/masters/infrastructure/modules/master-subscription/master-subscription.module';
import { CreateUserBlockUseCase } from '../../../application/use-cases/user-block/create-user-block.use-case';
import { DeleteUserBlockByIdUseCase } from '../../../application/use-cases/user-block/delete-user-block-by-id.use-case';
import { GetUserBlockByIdUseCase } from '../../../application/use-cases/user-block/get-user-block-by-id.use-case';
import { GetUserBlocksUseCase } from '../../../application/use-cases/user-block/get-user-blocks.use-case';
import type { IUserBlockRepository } from '../../../domain/repositories/user-block/i-user-block.repository';
import { USER_BLOCK_REPOSITORY_TOKEN } from '../../../domain/repositories/user-block/user-block.repository.tokens';
import type { IUserRepository } from '../../../domain/repositories/user/i-user.repository';
import { USER_REPOSITORY_TOKEN } from '../../../domain/repositories/user/user.repository.tokens';
import { PrismaUserBlockRepository } from '../../persistence/repositories/user-block/prisma-user-block.repository';
import { UserRepositoryModule } from '../user-repository/user-repository.module';

@Module({
  imports: [
    UserRepositoryModule,
    forwardRef(() => MasterProfileModule),
    forwardRef(() => MasterSubscriptionModule),
  ],
  providers: [
    {
      provide: USER_BLOCK_REPOSITORY_TOKEN,
      useClass: PrismaUserBlockRepository,
    },
    {
      provide: GetUserBlocksUseCase,
      useFactory: (repo: IUserBlockRepository) => new GetUserBlocksUseCase(repo),
      inject: [USER_BLOCK_REPOSITORY_TOKEN],
    },
    {
      provide: GetUserBlockByIdUseCase,
      useFactory: (repo: IUserBlockRepository) =>
        new GetUserBlockByIdUseCase(repo),
      inject: [USER_BLOCK_REPOSITORY_TOKEN],
    },
    {
      provide: CreateUserBlockUseCase,
      useFactory: (
        transactionManager: ITransactionManager,
        userBlockRepo: IUserBlockRepository,
        userRepo: IUserRepository,
        masterProfileRepo: IMasterProfileRepository,
        masterSubscriptionRepo: IMasterSubscriptionRepository,
      ) =>
        new CreateUserBlockUseCase(
          transactionManager,
          userBlockRepo,
          userRepo,
          masterProfileRepo,
          masterSubscriptionRepo,
        ),
      inject: [
        TRANSACTION_MANAGER_TOKEN,
        USER_BLOCK_REPOSITORY_TOKEN,
        USER_REPOSITORY_TOKEN,
        MASTER_PROFILE_REPOSITORY_TOKEN,
        MASTER_SUBSCRIPTION_REPOSITORY_TOKEN,
      ],
    },
    {
      provide: DeleteUserBlockByIdUseCase,
      useFactory: (
        transactionManager: ITransactionManager,
        userBlockRepo: IUserBlockRepository,
      ) =>
        new DeleteUserBlockByIdUseCase(transactionManager, userBlockRepo),
      inject: [TRANSACTION_MANAGER_TOKEN, USER_BLOCK_REPOSITORY_TOKEN],
    },
  ],
  exports: [
    USER_BLOCK_REPOSITORY_TOKEN,
    GetUserBlocksUseCase,
    GetUserBlockByIdUseCase,
    CreateUserBlockUseCase,
    DeleteUserBlockByIdUseCase,
  ],
})
export class UserBlockModule {}

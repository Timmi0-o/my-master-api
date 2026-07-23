import { Module } from '@nestjs/common';
import { TRANSACTION_MANAGER_TOKEN } from '@shared/domain/transactions';
import type { ITransactionManager } from '@shared/domain/transactions';
import { CreateFavoriteMasterServiceUseCase } from '../../../application/use-cases/favorite-master-service/create-favorite-master-service.use-case';
import { DeleteFavoriteMasterServiceByIdUseCase } from '../../../application/use-cases/favorite-master-service/delete-favorite-master-service-by-id.use-case';
import { GetFavoriteMasterServiceByIdUseCase } from '../../../application/use-cases/favorite-master-service/get-favorite-master-service-by-id.use-case';
import { GetFavoriteMasterServicesUseCase } from '../../../application/use-cases/favorite-master-service/get-favorite-master-services.use-case';
import type { IFavoriteMasterServiceRepository } from '../../../domain/repositories/favorite-master-service/i-favorite-master-service.repository';
import { FAVORITE_MASTER_SERVICE_REPOSITORY_TOKEN } from '../../../domain/repositories/favorite-master-service/favorite-master-service.repository.tokens';
import type { IMasterServiceRepository } from '../../../domain/repositories/master-service/i-master-service.repository';
import { MASTER_SERVICE_REPOSITORY_TOKEN } from '../../../domain/repositories/master-service/master-service.repository.tokens';
import { PrismaFavoriteMasterServiceRepository } from '../../persistence/repositories/favorite-master-service/prisma-favorite-master-service.repository';
import { MasterServiceModule } from '../master-service/master-service.module';

@Module({
  imports: [MasterServiceModule],
  providers: [
    {
      provide: FAVORITE_MASTER_SERVICE_REPOSITORY_TOKEN,
      useClass: PrismaFavoriteMasterServiceRepository,
    },
    {
      provide: GetFavoriteMasterServicesUseCase,
      useFactory: (repo: IFavoriteMasterServiceRepository) =>
        new GetFavoriteMasterServicesUseCase(repo),
      inject: [FAVORITE_MASTER_SERVICE_REPOSITORY_TOKEN],
    },
    {
      provide: GetFavoriteMasterServiceByIdUseCase,
      useFactory: (repo: IFavoriteMasterServiceRepository) =>
        new GetFavoriteMasterServiceByIdUseCase(repo),
      inject: [FAVORITE_MASTER_SERVICE_REPOSITORY_TOKEN],
    },
    {
      provide: CreateFavoriteMasterServiceUseCase,
      useFactory: (
        transactionManager: ITransactionManager,
        favoriteRepo: IFavoriteMasterServiceRepository,
        serviceRepo: IMasterServiceRepository,
      ) =>
        new CreateFavoriteMasterServiceUseCase(
          transactionManager,
          favoriteRepo,
          serviceRepo,
        ),
      inject: [
        TRANSACTION_MANAGER_TOKEN,
        FAVORITE_MASTER_SERVICE_REPOSITORY_TOKEN,
        MASTER_SERVICE_REPOSITORY_TOKEN,
      ],
    },
    {
      provide: DeleteFavoriteMasterServiceByIdUseCase,
      useFactory: (
        transactionManager: ITransactionManager,
        favoriteRepo: IFavoriteMasterServiceRepository,
      ) =>
        new DeleteFavoriteMasterServiceByIdUseCase(
          transactionManager,
          favoriteRepo,
        ),
      inject: [
        TRANSACTION_MANAGER_TOKEN,
        FAVORITE_MASTER_SERVICE_REPOSITORY_TOKEN,
      ],
    },
  ],
  exports: [
    FAVORITE_MASTER_SERVICE_REPOSITORY_TOKEN,
    GetFavoriteMasterServicesUseCase,
    GetFavoriteMasterServiceByIdUseCase,
    CreateFavoriteMasterServiceUseCase,
    DeleteFavoriteMasterServiceByIdUseCase,
  ],
})
export class FavoriteMasterServiceModule {}

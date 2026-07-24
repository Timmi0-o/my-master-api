import { Module } from '@nestjs/common';
import { TRANSACTION_MANAGER_TOKEN } from '@shared/domain/transactions';
import type { ITransactionManager } from '@shared/domain/transactions';
import { CreateMasterProfileUseCase } from '../../../application/use-cases/master-profile/create-master-profile.use-case';
import { DeleteMasterProfileByIdUseCase } from '../../../application/use-cases/master-profile/delete-master-profile-by-id.use-case';
import { GetMasterProfileByIdUseCase } from '../../../application/use-cases/master-profile/get-master-profile-by-id.use-case';
import { GetMasterProfilesUseCase } from '../../../application/use-cases/master-profile/get-master-profiles.use-case';
import { GetMyMasterProfileUseCase } from '../../../application/use-cases/master-profile/get-my-master-profile.use-case';
import { UpdateMasterProfileByIdUseCase } from '../../../application/use-cases/master-profile/update-master-profile-by-id.use-case';
import type { IMasterProfileRepository } from '../../../domain/repositories/master-profile/i-master-profile.repository';
import { MASTER_PROFILE_REPOSITORY_TOKEN } from '../../../domain/repositories/master-profile/master-profile.repository.tokens';
import { PrismaMasterProfileRepository } from '../../persistence/repositories/master-profile/prisma-master-profile.repository';
import { ImageModule } from '../image/image.module';

@Module({
  imports: [ImageModule],
  providers: [
    {
      provide: MASTER_PROFILE_REPOSITORY_TOKEN,
      useClass: PrismaMasterProfileRepository,
    },
    {
      provide: GetMasterProfilesUseCase,
      useFactory: (repo: IMasterProfileRepository) =>
        new GetMasterProfilesUseCase(repo),
      inject: [MASTER_PROFILE_REPOSITORY_TOKEN],
    },
    {
      provide: GetMasterProfileByIdUseCase,
      useFactory: (repo: IMasterProfileRepository) =>
        new GetMasterProfileByIdUseCase(repo),
      inject: [MASTER_PROFILE_REPOSITORY_TOKEN],
    },
    {
      provide: GetMyMasterProfileUseCase,
      useFactory: (repo: IMasterProfileRepository) =>
        new GetMyMasterProfileUseCase(repo),
      inject: [MASTER_PROFILE_REPOSITORY_TOKEN],
    },
    {
      provide: CreateMasterProfileUseCase,
      useFactory: (
        transactionManager: ITransactionManager,
        repo: IMasterProfileRepository,
      ) => new CreateMasterProfileUseCase(transactionManager, repo),
      inject: [TRANSACTION_MANAGER_TOKEN, MASTER_PROFILE_REPOSITORY_TOKEN],
    },
    {
      provide: UpdateMasterProfileByIdUseCase,
      useFactory: (
        transactionManager: ITransactionManager,
        repo: IMasterProfileRepository,
      ) => new UpdateMasterProfileByIdUseCase(transactionManager, repo),
      inject: [TRANSACTION_MANAGER_TOKEN, MASTER_PROFILE_REPOSITORY_TOKEN],
    },
    {
      provide: DeleteMasterProfileByIdUseCase,
      useFactory: (
        transactionManager: ITransactionManager,
        repo: IMasterProfileRepository,
      ) => new DeleteMasterProfileByIdUseCase(transactionManager, repo),
      inject: [TRANSACTION_MANAGER_TOKEN, MASTER_PROFILE_REPOSITORY_TOKEN],
    },
  ],
  exports: [
    MASTER_PROFILE_REPOSITORY_TOKEN,
    GetMasterProfilesUseCase,
    GetMasterProfileByIdUseCase,
    GetMyMasterProfileUseCase,
    CreateMasterProfileUseCase,
    UpdateMasterProfileByIdUseCase,
    DeleteMasterProfileByIdUseCase,
  ],
})
export class MasterProfileModule {}

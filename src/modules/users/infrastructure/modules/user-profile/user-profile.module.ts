import { Module, forwardRef } from '@nestjs/common';
import { TRANSACTION_MANAGER_TOKEN } from '@shared/domain/transactions';
import type { ITransactionManager } from '@shared/domain/transactions';
import { ImageModule } from 'src/modules/masters/infrastructure/modules/image/image.module';
import { CreateUserProfileUseCase } from '../../../application/use-cases/user-profile/create-user-profile.use-case';
import { DeleteUserProfileByIdUseCase } from '../../../application/use-cases/user-profile/delete-user-profile-by-id.use-case';
import { GetUserProfileByIdUseCase } from '../../../application/use-cases/user-profile/get-user-profile-by-id.use-case';
import { GetUserProfilesUseCase } from '../../../application/use-cases/user-profile/get-user-profiles.use-case';
import { GetMyUserProfileUseCase } from '../../../application/use-cases/user-profile/get-my-user-profile.use-case';
import { UpdateUserProfileByIdUseCase } from '../../../application/use-cases/user-profile/update-user-profile-by-id.use-case';
import type { IUserProfileRepository } from '../../../domain/repositories/user-profile/i-user-profile.repository';
import { USER_PROFILE_REPOSITORY_TOKEN } from '../../../domain/repositories/user-profile/user-profile.repository.tokens';
import { PrismaUserProfileRepository } from '../../persistence/repositories/user-profile/prisma-user-profile.repository';

@Module({
  imports: [forwardRef(() => ImageModule)],
  providers: [
    {
      provide: USER_PROFILE_REPOSITORY_TOKEN,
      useClass: PrismaUserProfileRepository,
    },
    {
      provide: GetUserProfilesUseCase,
      useFactory: (repo: IUserProfileRepository) =>
        new GetUserProfilesUseCase(repo),
      inject: [USER_PROFILE_REPOSITORY_TOKEN],
    },
    {
      provide: GetUserProfileByIdUseCase,
      useFactory: (repo: IUserProfileRepository) =>
        new GetUserProfileByIdUseCase(repo),
      inject: [USER_PROFILE_REPOSITORY_TOKEN],
    },
    {
      provide: GetMyUserProfileUseCase,
      useFactory: (repo: IUserProfileRepository) =>
        new GetMyUserProfileUseCase(repo),
      inject: [USER_PROFILE_REPOSITORY_TOKEN],
    },
    {
      provide: CreateUserProfileUseCase,
      useFactory: (
        transactionManager: ITransactionManager,
        repo: IUserProfileRepository,
      ) => new CreateUserProfileUseCase(transactionManager, repo),
      inject: [TRANSACTION_MANAGER_TOKEN, USER_PROFILE_REPOSITORY_TOKEN],
    },
    {
      provide: UpdateUserProfileByIdUseCase,
      useFactory: (
        transactionManager: ITransactionManager,
        repo: IUserProfileRepository,
      ) => new UpdateUserProfileByIdUseCase(transactionManager, repo),
      inject: [TRANSACTION_MANAGER_TOKEN, USER_PROFILE_REPOSITORY_TOKEN],
    },
    {
      provide: DeleteUserProfileByIdUseCase,
      useFactory: (
        transactionManager: ITransactionManager,
        repo: IUserProfileRepository,
      ) => new DeleteUserProfileByIdUseCase(transactionManager, repo),
      inject: [TRANSACTION_MANAGER_TOKEN, USER_PROFILE_REPOSITORY_TOKEN],
    },
  ],
  exports: [
    USER_PROFILE_REPOSITORY_TOKEN,
    GetUserProfilesUseCase,
    GetUserProfileByIdUseCase,
    GetMyUserProfileUseCase,
    CreateUserProfileUseCase,
    UpdateUserProfileByIdUseCase,
    DeleteUserProfileByIdUseCase,
    forwardRef(() => ImageModule),
  ],
})
export class UserProfileModule {}

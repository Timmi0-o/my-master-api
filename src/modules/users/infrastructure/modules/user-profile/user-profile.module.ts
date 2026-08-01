import { Module, forwardRef } from '@nestjs/common';
import { TRANSACTION_MANAGER_TOKEN } from '@shared/domain/transactions';
import type { ITransactionManager } from '@shared/domain/transactions';
import type { IAddressRepository } from 'src/modules/geo/domain/repositories/address';
import { ADDRESS_REPOSITORY_TOKEN } from 'src/modules/geo/domain/repositories/address';
import type { ILocalityRepository } from 'src/modules/geo/domain/repositories/locality';
import { LOCALITY_REPOSITORY_TOKEN } from 'src/modules/geo/domain/repositories/locality';
import { GeoModule } from 'src/modules/geo/geo.module';
import { ImageModule } from 'src/modules/masters/infrastructure/modules/image/image.module';
import { CreateUserProfileUseCase } from '../../../application/use-cases/user-profile/create-user-profile.use-case';
import { DeleteUserProfileAddressUseCase } from '../../../application/use-cases/user-profile/delete-user-profile-address.use-case';
import { DeleteUserProfileByIdUseCase } from '../../../application/use-cases/user-profile/delete-user-profile-by-id.use-case';
import { GetUserProfileAddressUseCase } from '../../../application/use-cases/user-profile/get-user-profile-address.use-case';
import { GetUserProfileByIdUseCase } from '../../../application/use-cases/user-profile/get-user-profile-by-id.use-case';
import { GetUserProfilesUseCase } from '../../../application/use-cases/user-profile/get-user-profiles.use-case';
import { GetMyUserProfileUseCase } from '../../../application/use-cases/user-profile/get-my-user-profile.use-case';
import { UpdateUserProfileByIdUseCase } from '../../../application/use-cases/user-profile/update-user-profile-by-id.use-case';
import { UpsertUserProfileAddressUseCase } from '../../../application/use-cases/user-profile/upsert-user-profile-address.use-case';
import type { IUserPersonalNoteRepository } from '../../../domain/repositories/user-personal-note/i-user-personal-note.repository';
import { USER_PERSONAL_NOTE_REPOSITORY_TOKEN } from '../../../domain/repositories/user-personal-note/user-personal-note.repository.tokens';
import type { IUserProfileRepository } from '../../../domain/repositories/user-profile/i-user-profile.repository';
import { USER_PROFILE_REPOSITORY_TOKEN } from '../../../domain/repositories/user-profile/user-profile.repository.tokens';
import { PrismaUserProfileRepository } from '../../persistence/repositories/user-profile/prisma-user-profile.repository';
import { UserPersonalNoteModule } from '../user-personal-note/user-personal-note.module';

@Module({
  imports: [forwardRef(() => ImageModule), UserPersonalNoteModule, GeoModule],
  providers: [
    {
      provide: USER_PROFILE_REPOSITORY_TOKEN,
      useClass: PrismaUserProfileRepository,
    },
    {
      provide: GetUserProfilesUseCase,
      useFactory: (
        repo: IUserProfileRepository,
        personalNoteRepo: IUserPersonalNoteRepository,
      ) => new GetUserProfilesUseCase(repo, personalNoteRepo),
      inject: [USER_PROFILE_REPOSITORY_TOKEN, USER_PERSONAL_NOTE_REPOSITORY_TOKEN],
    },
    {
      provide: GetUserProfileByIdUseCase,
      useFactory: (
        repo: IUserProfileRepository,
        personalNoteRepo: IUserPersonalNoteRepository,
      ) => new GetUserProfileByIdUseCase(repo, personalNoteRepo),
      inject: [USER_PROFILE_REPOSITORY_TOKEN, USER_PERSONAL_NOTE_REPOSITORY_TOKEN],
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
    {
      provide: GetUserProfileAddressUseCase,
      useFactory: (repo: IAddressRepository) =>
        new GetUserProfileAddressUseCase(repo),
      inject: [ADDRESS_REPOSITORY_TOKEN],
    },
    {
      provide: UpsertUserProfileAddressUseCase,
      useFactory: (
        transactionManager: ITransactionManager,
        addressRepo: IAddressRepository,
        localityRepo: ILocalityRepository,
      ) =>
        new UpsertUserProfileAddressUseCase(
          transactionManager,
          addressRepo,
          localityRepo,
        ),
      inject: [
        TRANSACTION_MANAGER_TOKEN,
        ADDRESS_REPOSITORY_TOKEN,
        LOCALITY_REPOSITORY_TOKEN,
      ],
    },
    {
      provide: DeleteUserProfileAddressUseCase,
      useFactory: (
        transactionManager: ITransactionManager,
        addressRepo: IAddressRepository,
      ) => new DeleteUserProfileAddressUseCase(transactionManager, addressRepo),
      inject: [TRANSACTION_MANAGER_TOKEN, ADDRESS_REPOSITORY_TOKEN],
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
    GetUserProfileAddressUseCase,
    UpsertUserProfileAddressUseCase,
    DeleteUserProfileAddressUseCase,
    forwardRef(() => ImageModule),
  ],
})
export class UserProfileModule {}

import { Module, forwardRef } from '@nestjs/common';
import { TRANSACTION_MANAGER_TOKEN } from '@shared/domain/transactions';
import type { ITransactionManager } from '@shared/domain/transactions';
import type { IAddressRepository } from 'src/modules/geo/domain/repositories/address';
import { ADDRESS_REPOSITORY_TOKEN } from 'src/modules/geo/domain/repositories/address';
import type { ILocalityRepository } from 'src/modules/geo/domain/repositories/locality';
import { LOCALITY_REPOSITORY_TOKEN } from 'src/modules/geo/domain/repositories/locality';
import { GeoModule } from 'src/modules/geo/geo.module';
import type { IUserPersonalNoteRepository } from 'src/modules/users/domain/repositories/user-personal-note/i-user-personal-note.repository';
import { USER_PERSONAL_NOTE_REPOSITORY_TOKEN } from 'src/modules/users/domain/repositories/user-personal-note/user-personal-note.repository.tokens';
import { UserPersonalNoteModule } from 'src/modules/users/infrastructure/modules/user-personal-note/user-personal-note.module';
import { MasterOnboardingService } from '../../../application/services/master-onboarding.service';
import { CreateMasterProfileUseCase } from '../../../application/use-cases/master-profile/create-master-profile.use-case';
import { DeleteMasterAddressUseCase } from '../../../application/use-cases/master-profile/delete-master-address.use-case';
import { DeleteMasterProfileByIdUseCase } from '../../../application/use-cases/master-profile/delete-master-profile-by-id.use-case';
import { GetMasterAddressUseCase } from '../../../application/use-cases/master-profile/get-master-address.use-case';
import { GetMasterOnboardingUseCase } from '../../../application/use-cases/master-profile/get-master-onboarding.use-case';
import { GetMasterProfileByIdUseCase } from '../../../application/use-cases/master-profile/get-master-profile-by-id.use-case';
import { GetMasterProfilesUseCase } from '../../../application/use-cases/master-profile/get-master-profiles.use-case';
import { GetMyMasterProfileUseCase } from '../../../application/use-cases/master-profile/get-my-master-profile.use-case';
import { ProcessIncompleteAcceptingMastersUseCase } from '../../../application/use-cases/master-profile/process-incomplete-accepting-masters.use-case';
import { UpdateMasterProfileByIdUseCase } from '../../../application/use-cases/master-profile/update-master-profile-by-id.use-case';
import { UpsertMasterAddressUseCase } from '../../../application/use-cases/master-profile/upsert-master-address.use-case';
import type { IMasterProfileRepository } from '../../../domain/repositories/master-profile/i-master-profile.repository';
import { MASTER_PROFILE_REPOSITORY_TOKEN } from '../../../domain/repositories/master-profile/master-profile.repository.tokens';
import type { IMasterServiceRepository } from '../../../domain/repositories/master-service/i-master-service.repository';
import { MASTER_SERVICE_REPOSITORY_TOKEN } from '../../../domain/repositories/master-service/master-service.repository.tokens';
import type { IMasterWeeklyScheduleRepository } from '../../../domain/repositories/master-weekly-schedule/i-master-weekly-schedule.repository';
import { MASTER_WEEKLY_SCHEDULE_REPOSITORY_TOKEN } from '../../../domain/repositories/master-weekly-schedule/master-weekly-schedule.repository.tokens';
import { PrismaMasterProfileRepository } from '../../persistence/repositories/master-profile/prisma-master-profile.repository';
import { MasterOnboardingDemoteScheduler } from '../../schedulers/master-onboarding-demote.scheduler';
import { ImageModule } from '../image/image.module';
import { MasterServiceModule } from '../master-service/master-service.module';
import { MasterWeeklyScheduleModule } from '../master-weekly-schedule/master-weekly-schedule.module';

@Module({
  imports: [
    forwardRef(() => ImageModule),
    UserPersonalNoteModule,
    GeoModule,
    forwardRef(() => MasterServiceModule),
    forwardRef(() => MasterWeeklyScheduleModule),
  ],
  providers: [
    {
      provide: MASTER_PROFILE_REPOSITORY_TOKEN,
      useClass: PrismaMasterProfileRepository,
    },
    {
      provide: MasterOnboardingService,
      useFactory: (
        serviceRepo: IMasterServiceRepository,
        weeklyRepo: IMasterWeeklyScheduleRepository,
        addressRepo: IAddressRepository,
      ) => new MasterOnboardingService(serviceRepo, weeklyRepo, addressRepo),
      inject: [
        MASTER_SERVICE_REPOSITORY_TOKEN,
        MASTER_WEEKLY_SCHEDULE_REPOSITORY_TOKEN,
        ADDRESS_REPOSITORY_TOKEN,
      ],
    },
    {
      provide: GetMasterProfilesUseCase,
      useFactory: (
        repo: IMasterProfileRepository,
        personalNoteRepo: IUserPersonalNoteRepository,
      ) => new GetMasterProfilesUseCase(repo, personalNoteRepo),
      inject: [
        MASTER_PROFILE_REPOSITORY_TOKEN,
        USER_PERSONAL_NOTE_REPOSITORY_TOKEN,
      ],
    },
    {
      provide: GetMasterProfileByIdUseCase,
      useFactory: (
        repo: IMasterProfileRepository,
        personalNoteRepo: IUserPersonalNoteRepository,
      ) => new GetMasterProfileByIdUseCase(repo, personalNoteRepo),
      inject: [
        MASTER_PROFILE_REPOSITORY_TOKEN,
        USER_PERSONAL_NOTE_REPOSITORY_TOKEN,
      ],
    },
    {
      provide: GetMyMasterProfileUseCase,
      useFactory: (repo: IMasterProfileRepository) =>
        new GetMyMasterProfileUseCase(repo),
      inject: [MASTER_PROFILE_REPOSITORY_TOKEN],
    },
    {
      provide: GetMasterOnboardingUseCase,
      useFactory: (
        repo: IMasterProfileRepository,
        onboardingService: MasterOnboardingService,
      ) => new GetMasterOnboardingUseCase(repo, onboardingService),
      inject: [MASTER_PROFILE_REPOSITORY_TOKEN, MasterOnboardingService],
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
        onboardingService: MasterOnboardingService,
      ) =>
        new UpdateMasterProfileByIdUseCase(
          transactionManager,
          repo,
          onboardingService,
        ),
      inject: [
        TRANSACTION_MANAGER_TOKEN,
        MASTER_PROFILE_REPOSITORY_TOKEN,
        MasterOnboardingService,
      ],
    },
    {
      provide: ProcessIncompleteAcceptingMastersUseCase,
      useFactory: (
        transactionManager: ITransactionManager,
        repo: IMasterProfileRepository,
        onboardingService: MasterOnboardingService,
      ) =>
        new ProcessIncompleteAcceptingMastersUseCase(
          transactionManager,
          repo,
          onboardingService,
        ),
      inject: [
        TRANSACTION_MANAGER_TOKEN,
        MASTER_PROFILE_REPOSITORY_TOKEN,
        MasterOnboardingService,
      ],
    },
    MasterOnboardingDemoteScheduler,
    {
      provide: DeleteMasterProfileByIdUseCase,
      useFactory: (
        transactionManager: ITransactionManager,
        repo: IMasterProfileRepository,
      ) => new DeleteMasterProfileByIdUseCase(transactionManager, repo),
      inject: [TRANSACTION_MANAGER_TOKEN, MASTER_PROFILE_REPOSITORY_TOKEN],
    },
    {
      provide: GetMasterAddressUseCase,
      useFactory: (repo: IAddressRepository) =>
        new GetMasterAddressUseCase(repo),
      inject: [ADDRESS_REPOSITORY_TOKEN],
    },
    {
      provide: UpsertMasterAddressUseCase,
      useFactory: (
        transactionManager: ITransactionManager,
        addressRepo: IAddressRepository,
        localityRepo: ILocalityRepository,
      ) =>
        new UpsertMasterAddressUseCase(
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
      provide: DeleteMasterAddressUseCase,
      useFactory: (
        transactionManager: ITransactionManager,
        addressRepo: IAddressRepository,
      ) => new DeleteMasterAddressUseCase(transactionManager, addressRepo),
      inject: [TRANSACTION_MANAGER_TOKEN, ADDRESS_REPOSITORY_TOKEN],
    },
  ],
  exports: [
    MASTER_PROFILE_REPOSITORY_TOKEN,
    GetMasterProfilesUseCase,
    GetMasterProfileByIdUseCase,
    GetMyMasterProfileUseCase,
    GetMasterOnboardingUseCase,
    CreateMasterProfileUseCase,
    UpdateMasterProfileByIdUseCase,
    DeleteMasterProfileByIdUseCase,
    GetMasterAddressUseCase,
    UpsertMasterAddressUseCase,
    DeleteMasterAddressUseCase,
    MasterOnboardingService,
    forwardRef(() => ImageModule),
  ],
})
export class MasterProfileModule {}

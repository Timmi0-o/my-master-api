import { Module } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/presentation/guards/jwt-auth.guard';
import { CreateMasterProfileUseCase } from './application/use-cases/master-profile/create-master-profile.use-case';
import { DeleteMasterProfileByIdUseCase } from './application/use-cases/master-profile/delete-master-profile-by-id.use-case';
import { GetMasterProfileByIdUseCase } from './application/use-cases/master-profile/get-master-profile-by-id.use-case';
import { GetMasterProfilesUseCase } from './application/use-cases/master-profile/get-master-profiles.use-case';
import { GetMyMasterProfileUseCase } from './application/use-cases/master-profile/get-my-master-profile.use-case';
import { UpdateMasterProfileByIdUseCase } from './application/use-cases/master-profile/update-master-profile-by-id.use-case';
import { CreateMasterServiceUseCase } from './application/use-cases/master-service/create-master-service.use-case';
import { DeleteMasterServiceByIdUseCase } from './application/use-cases/master-service/delete-master-service-by-id.use-case';
import { GetMasterServiceByIdUseCase } from './application/use-cases/master-service/get-master-service-by-id.use-case';
import { GetMasterServicesUseCase } from './application/use-cases/master-service/get-master-services.use-case';
import { UpdateMasterServiceByIdUseCase } from './application/use-cases/master-service/update-master-service-by-id.use-case';
import type { IMasterProfileRepository } from './domain/repositories/master-profile/i-master-profile.repository';
import { MASTER_PROFILE_REPOSITORY_TOKEN } from './domain/repositories/master-profile/master-profile.repository.tokens';
import type { IMasterServiceRepository } from './domain/repositories/master-service/i-master-service.repository';
import { MASTER_SERVICE_REPOSITORY_TOKEN } from './domain/repositories/master-service/master-service.repository.tokens';
import { PrismaMasterProfileRepository } from './infrastructure/persistence/repositories/master-profile/prisma-master-profile.repository';
import { PrismaMasterServiceRepository } from './infrastructure/persistence/repositories/master-service/prisma-master-service.repository';
import { MasterProfilesController } from './presentation/http/controllers/master-profiles.controller';
import { MasterServicesController } from './presentation/http/controllers/master-services.controller';
import { MasterProfileValidator } from './presentation/http/validation/master-profile.validator';
import { MasterServiceValidator } from './presentation/http/validation/master-service.validator';

@Module({
  controllers: [MasterProfilesController, MasterServicesController],
  providers: [
    MasterProfileValidator,
    MasterServiceValidator,
    JwtAuthGuard,
    {
      provide: MASTER_PROFILE_REPOSITORY_TOKEN,
      useClass: PrismaMasterProfileRepository,
    },
    {
      provide: MASTER_SERVICE_REPOSITORY_TOKEN,
      useClass: PrismaMasterServiceRepository,
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
      useFactory: (repo: IMasterProfileRepository) =>
        new CreateMasterProfileUseCase(repo),
      inject: [MASTER_PROFILE_REPOSITORY_TOKEN],
    },
    {
      provide: UpdateMasterProfileByIdUseCase,
      useFactory: (repo: IMasterProfileRepository) =>
        new UpdateMasterProfileByIdUseCase(repo),
      inject: [MASTER_PROFILE_REPOSITORY_TOKEN],
    },
    {
      provide: DeleteMasterProfileByIdUseCase,
      useFactory: (repo: IMasterProfileRepository) =>
        new DeleteMasterProfileByIdUseCase(repo),
      inject: [MASTER_PROFILE_REPOSITORY_TOKEN],
    },
    {
      provide: GetMasterServicesUseCase,
      useFactory: (repo: IMasterServiceRepository) =>
        new GetMasterServicesUseCase(repo),
      inject: [MASTER_SERVICE_REPOSITORY_TOKEN],
    },
    {
      provide: GetMasterServiceByIdUseCase,
      useFactory: (repo: IMasterServiceRepository) =>
        new GetMasterServiceByIdUseCase(repo),
      inject: [MASTER_SERVICE_REPOSITORY_TOKEN],
    },
    {
      provide: CreateMasterServiceUseCase,
      useFactory: (
        serviceRepo: IMasterServiceRepository,
        profileRepo: IMasterProfileRepository,
      ) => new CreateMasterServiceUseCase(serviceRepo, profileRepo),
      inject: [MASTER_SERVICE_REPOSITORY_TOKEN, MASTER_PROFILE_REPOSITORY_TOKEN],
    },
    {
      provide: UpdateMasterServiceByIdUseCase,
      useFactory: (
        serviceRepo: IMasterServiceRepository,
        profileRepo: IMasterProfileRepository,
      ) => new UpdateMasterServiceByIdUseCase(serviceRepo, profileRepo),
      inject: [MASTER_SERVICE_REPOSITORY_TOKEN, MASTER_PROFILE_REPOSITORY_TOKEN],
    },
    {
      provide: DeleteMasterServiceByIdUseCase,
      useFactory: (
        serviceRepo: IMasterServiceRepository,
        profileRepo: IMasterProfileRepository,
      ) => new DeleteMasterServiceByIdUseCase(serviceRepo, profileRepo),
      inject: [MASTER_SERVICE_REPOSITORY_TOKEN, MASTER_PROFILE_REPOSITORY_TOKEN],
    },
  ],
  exports: [MASTER_PROFILE_REPOSITORY_TOKEN, MASTER_SERVICE_REPOSITORY_TOKEN],
})
export class MastersModule {}

import { Module, forwardRef } from '@nestjs/common';
import { APPOINTMENT_REPOSITORY_TOKEN } from '../appointments/domain/repositories/appointment/appointment.repository.tokens';
import type { IAppointmentRepository } from '../appointments/domain/repositories/appointment/i-appointment.repository';
import { AppointmentsModule } from '../appointments/appointments.module';
import { JwtAuthGuard } from '../auth/presentation/guards/jwt-auth.guard';
import { CreateMasterProfileUseCase } from './application/use-cases/master-profile/create-master-profile.use-case';
import { DeleteMasterProfileByIdUseCase } from './application/use-cases/master-profile/delete-master-profile-by-id.use-case';
import { GetMasterProfileByIdUseCase } from './application/use-cases/master-profile/get-master-profile-by-id.use-case';
import { GetMasterProfilesUseCase } from './application/use-cases/master-profile/get-master-profiles.use-case';
import { GetMyMasterProfileUseCase } from './application/use-cases/master-profile/get-my-master-profile.use-case';
import { UpdateMasterProfileByIdUseCase } from './application/use-cases/master-profile/update-master-profile-by-id.use-case';
import { CreateMasterScheduleExceptionUseCase } from './application/use-cases/master-schedule-exception/create-master-schedule-exception.use-case';
import { DeleteMasterScheduleExceptionByIdUseCase } from './application/use-cases/master-schedule-exception/delete-master-schedule-exception-by-id.use-case';
import { GetMasterScheduleExceptionByIdUseCase } from './application/use-cases/master-schedule-exception/get-master-schedule-exception-by-id.use-case';
import { GetMasterScheduleExceptionsUseCase } from './application/use-cases/master-schedule-exception/get-master-schedule-exceptions.use-case';
import { UpdateMasterScheduleExceptionByIdUseCase } from './application/use-cases/master-schedule-exception/update-master-schedule-exception-by-id.use-case';
import { CreateMasterServiceUseCase } from './application/use-cases/master-service/create-master-service.use-case';
import { DeleteMasterServiceByIdUseCase } from './application/use-cases/master-service/delete-master-service-by-id.use-case';
import { GetMasterServiceByIdUseCase } from './application/use-cases/master-service/get-master-service-by-id.use-case';
import { GetMasterServiceAvailableSlotsUseCase } from './application/use-cases/master-service/get-master-service-available-slots.use-case';
import { GetMasterServicesUseCase } from './application/use-cases/master-service/get-master-services.use-case';
import { UpdateMasterServiceByIdUseCase } from './application/use-cases/master-service/update-master-service-by-id.use-case';
import { CreateMasterWeeklyScheduleUseCase } from './application/use-cases/master-weekly-schedule/create-master-weekly-schedule.use-case';
import { DeleteMasterWeeklyScheduleByIdUseCase } from './application/use-cases/master-weekly-schedule/delete-master-weekly-schedule-by-id.use-case';
import { GetMasterWeeklyScheduleByIdUseCase } from './application/use-cases/master-weekly-schedule/get-master-weekly-schedule-by-id.use-case';
import { GetMasterWeeklySchedulesUseCase } from './application/use-cases/master-weekly-schedule/get-master-weekly-schedules.use-case';
import { UpdateMasterWeeklyScheduleByIdUseCase } from './application/use-cases/master-weekly-schedule/update-master-weekly-schedule-by-id.use-case';
import type { IMasterProfileRepository } from './domain/repositories/master-profile/i-master-profile.repository';
import { MASTER_PROFILE_REPOSITORY_TOKEN } from './domain/repositories/master-profile/master-profile.repository.tokens';
import type { IMasterScheduleExceptionRepository } from './domain/repositories/master-schedule-exception/i-master-schedule-exception.repository';
import { MASTER_SCHEDULE_EXCEPTION_REPOSITORY_TOKEN } from './domain/repositories/master-schedule-exception/master-schedule-exception.repository.tokens';
import type { IMasterServiceRepository } from './domain/repositories/master-service/i-master-service.repository';
import { MASTER_SERVICE_REPOSITORY_TOKEN } from './domain/repositories/master-service/master-service.repository.tokens';
import type { IMasterWeeklyScheduleRepository } from './domain/repositories/master-weekly-schedule/i-master-weekly-schedule.repository';
import { MASTER_WEEKLY_SCHEDULE_REPOSITORY_TOKEN } from './domain/repositories/master-weekly-schedule/master-weekly-schedule.repository.tokens';
import { PrismaMasterProfileRepository } from './infrastructure/persistence/repositories/master-profile/prisma-master-profile.repository';
import { PrismaMasterScheduleExceptionRepository } from './infrastructure/persistence/repositories/master-schedule-exception/prisma-master-schedule-exception.repository';
import { PrismaMasterServiceRepository } from './infrastructure/persistence/repositories/master-service/prisma-master-service.repository';
import { PrismaMasterWeeklyScheduleRepository } from './infrastructure/persistence/repositories/master-weekly-schedule/prisma-master-weekly-schedule.repository';
import { MasterProfilesController } from './presentation/http/controllers/master-profiles.controller';
import { MasterScheduleExceptionsController } from './presentation/http/controllers/master-schedule-exceptions.controller';
import { MasterServicesController } from './presentation/http/controllers/master-services.controller';
import { MasterWeeklySchedulesController } from './presentation/http/controllers/master-weekly-schedules.controller';
import { MasterProfileValidator } from './presentation/http/validation/master-profile.validator';
import { MasterScheduleExceptionValidator } from './presentation/http/validation/master-schedule-exception.validator';
import { MasterServiceValidator } from './presentation/http/validation/master-service.validator';
import { MasterWeeklyScheduleValidator } from './presentation/http/validation/master-weekly-schedule.validator';

@Module({
  imports: [forwardRef(() => AppointmentsModule)],
  controllers: [
    MasterProfilesController,
    MasterServicesController,
    MasterWeeklySchedulesController,
    MasterScheduleExceptionsController,
  ],
  providers: [
    MasterProfileValidator,
    MasterServiceValidator,
    MasterWeeklyScheduleValidator,
    MasterScheduleExceptionValidator,
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
      provide: MASTER_WEEKLY_SCHEDULE_REPOSITORY_TOKEN,
      useClass: PrismaMasterWeeklyScheduleRepository,
    },
    {
      provide: MASTER_SCHEDULE_EXCEPTION_REPOSITORY_TOKEN,
      useClass: PrismaMasterScheduleExceptionRepository,
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
      provide: GetMasterServiceAvailableSlotsUseCase,
      useFactory: (
        serviceRepo: IMasterServiceRepository,
        profileRepo: IMasterProfileRepository,
        weeklyRepo: IMasterWeeklyScheduleRepository,
        exceptionRepo: IMasterScheduleExceptionRepository,
        appointmentRepo: IAppointmentRepository,
      ) =>
        new GetMasterServiceAvailableSlotsUseCase(
          serviceRepo,
          profileRepo,
          weeklyRepo,
          exceptionRepo,
          appointmentRepo,
        ),
      inject: [
        MASTER_SERVICE_REPOSITORY_TOKEN,
        MASTER_PROFILE_REPOSITORY_TOKEN,
        MASTER_WEEKLY_SCHEDULE_REPOSITORY_TOKEN,
        MASTER_SCHEDULE_EXCEPTION_REPOSITORY_TOKEN,
        APPOINTMENT_REPOSITORY_TOKEN,
      ],
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
    {
      provide: GetMasterWeeklySchedulesUseCase,
      useFactory: (repo: IMasterWeeklyScheduleRepository) =>
        new GetMasterWeeklySchedulesUseCase(repo),
      inject: [MASTER_WEEKLY_SCHEDULE_REPOSITORY_TOKEN],
    },
    {
      provide: GetMasterWeeklyScheduleByIdUseCase,
      useFactory: (repo: IMasterWeeklyScheduleRepository) =>
        new GetMasterWeeklyScheduleByIdUseCase(repo),
      inject: [MASTER_WEEKLY_SCHEDULE_REPOSITORY_TOKEN],
    },
    {
      provide: CreateMasterWeeklyScheduleUseCase,
      useFactory: (
        scheduleRepo: IMasterWeeklyScheduleRepository,
        profileRepo: IMasterProfileRepository,
      ) => new CreateMasterWeeklyScheduleUseCase(scheduleRepo, profileRepo),
      inject: [
        MASTER_WEEKLY_SCHEDULE_REPOSITORY_TOKEN,
        MASTER_PROFILE_REPOSITORY_TOKEN,
      ],
    },
    {
      provide: UpdateMasterWeeklyScheduleByIdUseCase,
      useFactory: (
        scheduleRepo: IMasterWeeklyScheduleRepository,
        profileRepo: IMasterProfileRepository,
      ) => new UpdateMasterWeeklyScheduleByIdUseCase(scheduleRepo, profileRepo),
      inject: [
        MASTER_WEEKLY_SCHEDULE_REPOSITORY_TOKEN,
        MASTER_PROFILE_REPOSITORY_TOKEN,
      ],
    },
    {
      provide: DeleteMasterWeeklyScheduleByIdUseCase,
      useFactory: (
        scheduleRepo: IMasterWeeklyScheduleRepository,
        profileRepo: IMasterProfileRepository,
      ) => new DeleteMasterWeeklyScheduleByIdUseCase(scheduleRepo, profileRepo),
      inject: [
        MASTER_WEEKLY_SCHEDULE_REPOSITORY_TOKEN,
        MASTER_PROFILE_REPOSITORY_TOKEN,
      ],
    },
    {
      provide: GetMasterScheduleExceptionsUseCase,
      useFactory: (repo: IMasterScheduleExceptionRepository) =>
        new GetMasterScheduleExceptionsUseCase(repo),
      inject: [MASTER_SCHEDULE_EXCEPTION_REPOSITORY_TOKEN],
    },
    {
      provide: GetMasterScheduleExceptionByIdUseCase,
      useFactory: (repo: IMasterScheduleExceptionRepository) =>
        new GetMasterScheduleExceptionByIdUseCase(repo),
      inject: [MASTER_SCHEDULE_EXCEPTION_REPOSITORY_TOKEN],
    },
    {
      provide: CreateMasterScheduleExceptionUseCase,
      useFactory: (
        exceptionRepo: IMasterScheduleExceptionRepository,
        profileRepo: IMasterProfileRepository,
      ) => new CreateMasterScheduleExceptionUseCase(exceptionRepo, profileRepo),
      inject: [
        MASTER_SCHEDULE_EXCEPTION_REPOSITORY_TOKEN,
        MASTER_PROFILE_REPOSITORY_TOKEN,
      ],
    },
    {
      provide: UpdateMasterScheduleExceptionByIdUseCase,
      useFactory: (
        exceptionRepo: IMasterScheduleExceptionRepository,
        profileRepo: IMasterProfileRepository,
      ) =>
        new UpdateMasterScheduleExceptionByIdUseCase(exceptionRepo, profileRepo),
      inject: [
        MASTER_SCHEDULE_EXCEPTION_REPOSITORY_TOKEN,
        MASTER_PROFILE_REPOSITORY_TOKEN,
      ],
    },
    {
      provide: DeleteMasterScheduleExceptionByIdUseCase,
      useFactory: (
        exceptionRepo: IMasterScheduleExceptionRepository,
        profileRepo: IMasterProfileRepository,
      ) =>
        new DeleteMasterScheduleExceptionByIdUseCase(exceptionRepo, profileRepo),
      inject: [
        MASTER_SCHEDULE_EXCEPTION_REPOSITORY_TOKEN,
        MASTER_PROFILE_REPOSITORY_TOKEN,
      ],
    },
  ],
  exports: [
    MASTER_PROFILE_REPOSITORY_TOKEN,
    MASTER_SERVICE_REPOSITORY_TOKEN,
    MASTER_WEEKLY_SCHEDULE_REPOSITORY_TOKEN,
    MASTER_SCHEDULE_EXCEPTION_REPOSITORY_TOKEN,
  ],
})
export class MastersModule {}

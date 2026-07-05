import { Module, forwardRef } from '@nestjs/common';
import type { ITransactionManager } from '@shared/domain/transactions';
import { TRANSACTION_MANAGER_TOKEN } from '@shared/domain/transactions';
import { DeleteFilesUseCase } from 'src/modules/files/application/use-cases/file/delete-files.use-case';
import { PresignedUploadUseCase } from 'src/modules/files/application/use-cases/file/presigned-upload.use-case';
import { FilesModule } from 'src/modules/files/files.module';
import { AppointmentsModule } from '../../../../appointments/appointments.module';
import { APPOINTMENT_REPOSITORY_TOKEN } from '../../../../appointments/domain/repositories/appointment/appointment.repository.tokens';
import type { IAppointmentRepository } from '../../../../appointments/domain/repositories/appointment/i-appointment.repository';
import { CreateMasterServiceUseCase } from '../../../application/use-cases/master-service/create-master-service.use-case';
import { DeleteMasterServiceImagesUseCase } from '../../../application/use-cases/master-service/delete-master-service-images.use-case';
import { DeleteMasterServiceByIdUseCase } from '../../../application/use-cases/master-service/delete-master-service-by-id.use-case';
import { GetMasterServiceAvailableSlotsUseCase } from '../../../application/use-cases/master-service/get-master-service-available-slots.use-case';
import { GetMasterServiceByIdUseCase } from '../../../application/use-cases/master-service/get-master-service-by-id.use-case';
import { GetMasterServicesUseCase } from '../../../application/use-cases/master-service/get-master-services.use-case';
import { GetMyServicesUseCase } from '../../../application/use-cases/master-service/get-my-services.use-case';
import { PresignMasterServiceImagesUseCase } from '../../../application/use-cases/master-service/presign-master-service-images.use-case';
import { UpdateMasterServiceByIdUseCase } from '../../../application/use-cases/master-service/update-master-service-by-id.use-case';
import type { IMasterProfileRepository } from '../../../domain/repositories/master-profile/i-master-profile.repository';
import { MASTER_PROFILE_REPOSITORY_TOKEN } from '../../../domain/repositories/master-profile/master-profile.repository.tokens';
import type { IMasterScheduleExceptionRepository } from '../../../domain/repositories/master-schedule-exception/i-master-schedule-exception.repository';
import { MASTER_SCHEDULE_EXCEPTION_REPOSITORY_TOKEN } from '../../../domain/repositories/master-schedule-exception/master-schedule-exception.repository.tokens';
import type { IMasterServiceImageRepository } from '../../../domain/repositories/master-service-image/i-master-service-image.repository';
import { MASTER_SERVICE_IMAGE_REPOSITORY_TOKEN } from '../../../domain/repositories/master-service-image/master-service-image.repository.tokens';
import type { IMasterServiceRepository } from '../../../domain/repositories/master-service/i-master-service.repository';
import { MASTER_SERVICE_REPOSITORY_TOKEN } from '../../../domain/repositories/master-service/master-service.repository.tokens';
import type { IMasterWeeklyScheduleRepository } from '../../../domain/repositories/master-weekly-schedule/i-master-weekly-schedule.repository';
import { MASTER_WEEKLY_SCHEDULE_REPOSITORY_TOKEN } from '../../../domain/repositories/master-weekly-schedule/master-weekly-schedule.repository.tokens';
import { PrismaMasterServiceImageRepository } from '../../persistence/repositories/master-service-image/prisma-master-service-image.repository';
import { PrismaMasterServiceRepository } from '../../persistence/repositories/master-service/prisma-master-service.repository';
import { MasterProfileModule } from '../master-profile/master-profile.module';
import { MasterScheduleExceptionModule } from '../master-schedule-exception/master-schedule-exception.module';
import { MasterWeeklyScheduleModule } from '../master-weekly-schedule/master-weekly-schedule.module';

@Module({
  imports: [
    FilesModule,
    MasterProfileModule,
    MasterWeeklyScheduleModule,
    MasterScheduleExceptionModule,
    forwardRef(() => AppointmentsModule),
  ],
  providers: [
    {
      provide: MASTER_SERVICE_REPOSITORY_TOKEN,
      useClass: PrismaMasterServiceRepository,
    },
    {
      provide: MASTER_SERVICE_IMAGE_REPOSITORY_TOKEN,
      useClass: PrismaMasterServiceImageRepository,
    },
    {
      provide: GetMasterServicesUseCase,
      useFactory: (repo: IMasterServiceRepository) =>
        new GetMasterServicesUseCase(repo),
      inject: [MASTER_SERVICE_REPOSITORY_TOKEN],
    },
    {
      provide: GetMyServicesUseCase,
      useFactory: (
        serviceRepo: IMasterServiceRepository,
        profileRepo: IMasterProfileRepository,
      ) => new GetMyServicesUseCase(serviceRepo, profileRepo),
      inject: [
        MASTER_SERVICE_REPOSITORY_TOKEN,
        MASTER_PROFILE_REPOSITORY_TOKEN,
      ],
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
        transactionManager: ITransactionManager,
        serviceRepo: IMasterServiceRepository,
        profileRepo: IMasterProfileRepository,
      ) =>
        new CreateMasterServiceUseCase(
          transactionManager,
          serviceRepo,
          profileRepo,
        ),
      inject: [
        TRANSACTION_MANAGER_TOKEN,
        MASTER_SERVICE_REPOSITORY_TOKEN,
        MASTER_PROFILE_REPOSITORY_TOKEN,
      ],
    },
    {
      provide: UpdateMasterServiceByIdUseCase,
      useFactory: (
        transactionManager: ITransactionManager,
        serviceRepo: IMasterServiceRepository,
        profileRepo: IMasterProfileRepository,
      ) =>
        new UpdateMasterServiceByIdUseCase(
          transactionManager,
          serviceRepo,
          profileRepo,
        ),
      inject: [
        TRANSACTION_MANAGER_TOKEN,
        MASTER_SERVICE_REPOSITORY_TOKEN,
        MASTER_PROFILE_REPOSITORY_TOKEN,
      ],
    },
    {
      provide: DeleteMasterServiceByIdUseCase,
      useFactory: (
        transactionManager: ITransactionManager,
        serviceRepo: IMasterServiceRepository,
        profileRepo: IMasterProfileRepository,
      ) =>
        new DeleteMasterServiceByIdUseCase(
          transactionManager,
          serviceRepo,
          profileRepo,
        ),
      inject: [
        TRANSACTION_MANAGER_TOKEN,
        MASTER_SERVICE_REPOSITORY_TOKEN,
        MASTER_PROFILE_REPOSITORY_TOKEN,
      ],
    },
    {
      provide: PresignMasterServiceImagesUseCase,
      useFactory: (
        transactionManager: ITransactionManager,
        serviceRepo: IMasterServiceRepository,
        profileRepo: IMasterProfileRepository,
        imageRepo: IMasterServiceImageRepository,
        presignedUploadUseCase: PresignedUploadUseCase,
      ) =>
        new PresignMasterServiceImagesUseCase(
          transactionManager,
          serviceRepo,
          profileRepo,
          imageRepo,
          presignedUploadUseCase,
        ),
      inject: [
        TRANSACTION_MANAGER_TOKEN,
        MASTER_SERVICE_REPOSITORY_TOKEN,
        MASTER_PROFILE_REPOSITORY_TOKEN,
        MASTER_SERVICE_IMAGE_REPOSITORY_TOKEN,
        PresignedUploadUseCase,
      ],
    },
    {
      provide: DeleteMasterServiceImagesUseCase,
      useFactory: (
        transactionManager: ITransactionManager,
        serviceRepo: IMasterServiceRepository,
        profileRepo: IMasterProfileRepository,
        imageRepo: IMasterServiceImageRepository,
        deleteFilesUseCase: DeleteFilesUseCase,
      ) =>
        new DeleteMasterServiceImagesUseCase(
          transactionManager,
          serviceRepo,
          profileRepo,
          imageRepo,
          deleteFilesUseCase,
        ),
      inject: [
        TRANSACTION_MANAGER_TOKEN,
        MASTER_SERVICE_REPOSITORY_TOKEN,
        MASTER_PROFILE_REPOSITORY_TOKEN,
        MASTER_SERVICE_IMAGE_REPOSITORY_TOKEN,
        DeleteFilesUseCase,
      ],
    },
  ],
  exports: [
    MASTER_SERVICE_REPOSITORY_TOKEN,
    MASTER_SERVICE_IMAGE_REPOSITORY_TOKEN,
    GetMasterServicesUseCase,
    GetMyServicesUseCase,
    GetMasterServiceByIdUseCase,
    GetMasterServiceAvailableSlotsUseCase,
    CreateMasterServiceUseCase,
    UpdateMasterServiceByIdUseCase,
    DeleteMasterServiceByIdUseCase,
    PresignMasterServiceImagesUseCase,
    DeleteMasterServiceImagesUseCase,
  ],
})
export class MasterServiceModule {}

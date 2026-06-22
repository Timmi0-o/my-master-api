import { Module } from '@nestjs/common';
import { TRANSACTION_MANAGER_TOKEN } from '@shared/domain/transactions';
import type { ITransactionManager } from '@shared/domain/transactions';
import { CreateMasterWeeklyScheduleUseCase } from '../../../application/use-cases/master-weekly-schedule/create-master-weekly-schedule.use-case';
import { DeleteMasterWeeklyScheduleByIdUseCase } from '../../../application/use-cases/master-weekly-schedule/delete-master-weekly-schedule-by-id.use-case';
import { GetMasterWeeklyScheduleByIdUseCase } from '../../../application/use-cases/master-weekly-schedule/get-master-weekly-schedule-by-id.use-case';
import { GetMasterWeeklySchedulesUseCase } from '../../../application/use-cases/master-weekly-schedule/get-master-weekly-schedules.use-case';
import { UpdateMasterWeeklyScheduleByIdUseCase } from '../../../application/use-cases/master-weekly-schedule/update-master-weekly-schedule-by-id.use-case';
import type { IMasterProfileRepository } from '../../../domain/repositories/master-profile/i-master-profile.repository';
import { MASTER_PROFILE_REPOSITORY_TOKEN } from '../../../domain/repositories/master-profile/master-profile.repository.tokens';
import type { IMasterWeeklyScheduleRepository } from '../../../domain/repositories/master-weekly-schedule/i-master-weekly-schedule.repository';
import { MASTER_WEEKLY_SCHEDULE_REPOSITORY_TOKEN } from '../../../domain/repositories/master-weekly-schedule/master-weekly-schedule.repository.tokens';
import { PrismaMasterWeeklyScheduleRepository } from '../../persistence/repositories/master-weekly-schedule/prisma-master-weekly-schedule.repository';
import { MasterWeeklyScheduleValidator } from '../../../presentation/http/validation/master-weekly-schedule.validator';
import { MasterProfileModule } from '../master-profile/master-profile.module';

@Module({
  imports: [MasterProfileModule],
  providers: [
    MasterWeeklyScheduleValidator,
    {
      provide: MASTER_WEEKLY_SCHEDULE_REPOSITORY_TOKEN,
      useClass: PrismaMasterWeeklyScheduleRepository,
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
        transactionManager: ITransactionManager,
        scheduleRepo: IMasterWeeklyScheduleRepository,
        profileRepo: IMasterProfileRepository,
      ) =>
        new CreateMasterWeeklyScheduleUseCase(
          transactionManager,
          scheduleRepo,
          profileRepo,
        ),
      inject: [
        TRANSACTION_MANAGER_TOKEN,
        MASTER_WEEKLY_SCHEDULE_REPOSITORY_TOKEN,
        MASTER_PROFILE_REPOSITORY_TOKEN,
      ],
    },
    {
      provide: UpdateMasterWeeklyScheduleByIdUseCase,
      useFactory: (
        transactionManager: ITransactionManager,
        scheduleRepo: IMasterWeeklyScheduleRepository,
        profileRepo: IMasterProfileRepository,
      ) =>
        new UpdateMasterWeeklyScheduleByIdUseCase(
          transactionManager,
          scheduleRepo,
          profileRepo,
        ),
      inject: [
        TRANSACTION_MANAGER_TOKEN,
        MASTER_WEEKLY_SCHEDULE_REPOSITORY_TOKEN,
        MASTER_PROFILE_REPOSITORY_TOKEN,
      ],
    },
    {
      provide: DeleteMasterWeeklyScheduleByIdUseCase,
      useFactory: (
        transactionManager: ITransactionManager,
        scheduleRepo: IMasterWeeklyScheduleRepository,
        profileRepo: IMasterProfileRepository,
      ) =>
        new DeleteMasterWeeklyScheduleByIdUseCase(
          transactionManager,
          scheduleRepo,
          profileRepo,
        ),
      inject: [
        TRANSACTION_MANAGER_TOKEN,
        MASTER_WEEKLY_SCHEDULE_REPOSITORY_TOKEN,
        MASTER_PROFILE_REPOSITORY_TOKEN,
      ],
    },
  ],
  exports: [
    MASTER_WEEKLY_SCHEDULE_REPOSITORY_TOKEN,
    MasterWeeklyScheduleValidator,
    GetMasterWeeklySchedulesUseCase,
    GetMasterWeeklyScheduleByIdUseCase,
    CreateMasterWeeklyScheduleUseCase,
    UpdateMasterWeeklyScheduleByIdUseCase,
    DeleteMasterWeeklyScheduleByIdUseCase,
  ],
})
export class MasterWeeklyScheduleModule {}

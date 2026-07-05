import { Module } from '@nestjs/common';
import { TRANSACTION_MANAGER_TOKEN } from '@shared/domain/transactions';
import type { ITransactionManager } from '@shared/domain/transactions';
import { CreateMasterScheduleExceptionUseCase } from '../../../application/use-cases/master-schedule-exception/create-master-schedule-exception.use-case';
import { DeleteMasterScheduleExceptionByIdUseCase } from '../../../application/use-cases/master-schedule-exception/delete-master-schedule-exception-by-id.use-case';
import { GetMasterScheduleExceptionByIdUseCase } from '../../../application/use-cases/master-schedule-exception/get-master-schedule-exception-by-id.use-case';
import { GetMasterScheduleExceptionsUseCase } from '../../../application/use-cases/master-schedule-exception/get-master-schedule-exceptions.use-case';
import { UpdateMasterScheduleExceptionByIdUseCase } from '../../../application/use-cases/master-schedule-exception/update-master-schedule-exception-by-id.use-case';
import type { IMasterProfileRepository } from '../../../domain/repositories/master-profile/i-master-profile.repository';
import { MASTER_PROFILE_REPOSITORY_TOKEN } from '../../../domain/repositories/master-profile/master-profile.repository.tokens';
import type { IMasterScheduleExceptionRepository } from '../../../domain/repositories/master-schedule-exception/i-master-schedule-exception.repository';
import { MASTER_SCHEDULE_EXCEPTION_REPOSITORY_TOKEN } from '../../../domain/repositories/master-schedule-exception/master-schedule-exception.repository.tokens';
import { PrismaMasterScheduleExceptionRepository } from '../../persistence/repositories/master-schedule-exception/prisma-master-schedule-exception.repository';
import { MasterProfileModule } from '../master-profile/master-profile.module';

@Module({
  imports: [MasterProfileModule],
  providers: [
    {
      provide: MASTER_SCHEDULE_EXCEPTION_REPOSITORY_TOKEN,
      useClass: PrismaMasterScheduleExceptionRepository,
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
        transactionManager: ITransactionManager,
        exceptionRepo: IMasterScheduleExceptionRepository,
        profileRepo: IMasterProfileRepository,
      ) =>
        new CreateMasterScheduleExceptionUseCase(
          transactionManager,
          exceptionRepo,
          profileRepo,
        ),
      inject: [
        TRANSACTION_MANAGER_TOKEN,
        MASTER_SCHEDULE_EXCEPTION_REPOSITORY_TOKEN,
        MASTER_PROFILE_REPOSITORY_TOKEN,
      ],
    },
    {
      provide: UpdateMasterScheduleExceptionByIdUseCase,
      useFactory: (
        transactionManager: ITransactionManager,
        exceptionRepo: IMasterScheduleExceptionRepository,
        profileRepo: IMasterProfileRepository,
      ) =>
        new UpdateMasterScheduleExceptionByIdUseCase(
          transactionManager,
          exceptionRepo,
          profileRepo,
        ),
      inject: [
        TRANSACTION_MANAGER_TOKEN,
        MASTER_SCHEDULE_EXCEPTION_REPOSITORY_TOKEN,
        MASTER_PROFILE_REPOSITORY_TOKEN,
      ],
    },
    {
      provide: DeleteMasterScheduleExceptionByIdUseCase,
      useFactory: (
        transactionManager: ITransactionManager,
        exceptionRepo: IMasterScheduleExceptionRepository,
        profileRepo: IMasterProfileRepository,
      ) =>
        new DeleteMasterScheduleExceptionByIdUseCase(
          transactionManager,
          exceptionRepo,
          profileRepo,
        ),
      inject: [
        TRANSACTION_MANAGER_TOKEN,
        MASTER_SCHEDULE_EXCEPTION_REPOSITORY_TOKEN,
        MASTER_PROFILE_REPOSITORY_TOKEN,
      ],
    },
  ],
  exports: [
    MASTER_SCHEDULE_EXCEPTION_REPOSITORY_TOKEN,
    GetMasterScheduleExceptionsUseCase,
    GetMasterScheduleExceptionByIdUseCase,
    CreateMasterScheduleExceptionUseCase,
    UpdateMasterScheduleExceptionByIdUseCase,
    DeleteMasterScheduleExceptionByIdUseCase,
  ],
})
export class MasterScheduleExceptionModule {}

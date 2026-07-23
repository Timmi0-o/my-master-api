import { Module, forwardRef } from '@nestjs/common';
import { TRANSACTION_MANAGER_TOKEN } from '@shared/domain/transactions';
import type { ITransactionManager } from '@shared/domain/transactions';
import { AppointmentsModule } from '../../../../appointments/appointments.module';
import { APPOINTMENT_REPOSITORY_TOKEN } from '../../../../appointments/domain/repositories/appointment/appointment.repository.tokens';
import type { IAppointmentRepository } from '../../../../appointments/domain/repositories/appointment/i-appointment.repository';
import { CreateMasterServiceReviewUseCase } from '../../../application/use-cases/master-service-review/create-master-service-review.use-case';
import { DeleteMasterServiceReviewByIdUseCase } from '../../../application/use-cases/master-service-review/delete-master-service-review-by-id.use-case';
import { GetMasterServiceReviewByIdUseCase } from '../../../application/use-cases/master-service-review/get-master-service-review-by-id.use-case';
import { GetMasterServiceReviewsUseCase } from '../../../application/use-cases/master-service-review/get-master-service-reviews.use-case';
import { UpdateMasterServiceReviewByIdUseCase } from '../../../application/use-cases/master-service-review/update-master-service-review-by-id.use-case';
import type { IMasterServiceReviewReactionRepository } from '../../../domain/repositories/master-service-review-reaction/i-master-service-review-reaction.repository';
import { MASTER_SERVICE_REVIEW_REACTION_REPOSITORY_TOKEN } from '../../../domain/repositories/master-service-review-reaction/master-service-review-reaction.repository.tokens';
import type { IMasterServiceReviewRepository } from '../../../domain/repositories/master-service-review/i-master-service-review.repository';
import { MASTER_SERVICE_REVIEW_REPOSITORY_TOKEN } from '../../../domain/repositories/master-service-review/master-service-review.repository.tokens';
import { PrismaMasterServiceReviewRepository } from '../../persistence/repositories/master-service-review/prisma-master-service-review.repository';
import { MasterServiceReviewReactionModule } from '../master-service-review-reaction/master-service-review-reaction.module';

@Module({
  imports: [
    forwardRef(() => AppointmentsModule),
    forwardRef(() => MasterServiceReviewReactionModule),
  ],
  providers: [
    {
      provide: MASTER_SERVICE_REVIEW_REPOSITORY_TOKEN,
      useClass: PrismaMasterServiceReviewRepository,
    },
    {
      provide: GetMasterServiceReviewsUseCase,
      useFactory: (
        reviewRepo: IMasterServiceReviewRepository,
        reactionRepo: IMasterServiceReviewReactionRepository,
      ) => new GetMasterServiceReviewsUseCase(reviewRepo, reactionRepo),
      inject: [
        MASTER_SERVICE_REVIEW_REPOSITORY_TOKEN,
        MASTER_SERVICE_REVIEW_REACTION_REPOSITORY_TOKEN,
      ],
    },
    {
      provide: GetMasterServiceReviewByIdUseCase,
      useFactory: (
        reviewRepo: IMasterServiceReviewRepository,
        reactionRepo: IMasterServiceReviewReactionRepository,
      ) => new GetMasterServiceReviewByIdUseCase(reviewRepo, reactionRepo),
      inject: [
        MASTER_SERVICE_REVIEW_REPOSITORY_TOKEN,
        MASTER_SERVICE_REVIEW_REACTION_REPOSITORY_TOKEN,
      ],
    },
    {
      provide: CreateMasterServiceReviewUseCase,
      useFactory: (
        transactionManager: ITransactionManager,
        reviewRepo: IMasterServiceReviewRepository,
        appointmentRepo: IAppointmentRepository,
      ) =>
        new CreateMasterServiceReviewUseCase(
          transactionManager,
          reviewRepo,
          appointmentRepo,
        ),
      inject: [
        TRANSACTION_MANAGER_TOKEN,
        MASTER_SERVICE_REVIEW_REPOSITORY_TOKEN,
        APPOINTMENT_REPOSITORY_TOKEN,
      ],
    },
    {
      provide: UpdateMasterServiceReviewByIdUseCase,
      useFactory: (
        transactionManager: ITransactionManager,
        reviewRepo: IMasterServiceReviewRepository,
      ) =>
        new UpdateMasterServiceReviewByIdUseCase(
          transactionManager,
          reviewRepo,
        ),
      inject: [TRANSACTION_MANAGER_TOKEN, MASTER_SERVICE_REVIEW_REPOSITORY_TOKEN],
    },
    {
      provide: DeleteMasterServiceReviewByIdUseCase,
      useFactory: (
        transactionManager: ITransactionManager,
        reviewRepo: IMasterServiceReviewRepository,
      ) =>
        new DeleteMasterServiceReviewByIdUseCase(
          transactionManager,
          reviewRepo,
        ),
      inject: [TRANSACTION_MANAGER_TOKEN, MASTER_SERVICE_REVIEW_REPOSITORY_TOKEN],
    },
  ],
  exports: [
    MASTER_SERVICE_REVIEW_REPOSITORY_TOKEN,
    GetMasterServiceReviewsUseCase,
    GetMasterServiceReviewByIdUseCase,
    CreateMasterServiceReviewUseCase,
    UpdateMasterServiceReviewByIdUseCase,
    DeleteMasterServiceReviewByIdUseCase,
  ],
})
export class MasterServiceReviewModule {}

import { Module, forwardRef } from '@nestjs/common';
import { TRANSACTION_MANAGER_TOKEN } from '@shared/domain/transactions';
import type { ITransactionManager } from '@shared/domain/transactions';
import { CreateNotificationUseCase } from '@modules/notifications/application/use-cases/notification/create-notification.use-case';
import { NotificationMessageCatalog } from '@modules/notifications/infrastructure/i18n/notification-message-catalog';
import { NotificationsModule } from '@modules/notifications/notifications.module';
import { SendWebPushToUserUseCase } from '@modules/web-push-subscriptions/application/use-cases/web-push-subscription/send-web-push-to-user.use-case';
import { WebPushSubscriptionsModule } from '@modules/web-push-subscriptions/web-push-subscriptions.module';
import type { IUserRepository } from 'src/modules/users/domain/repositories/user/i-user.repository';
import { USER_REPOSITORY_TOKEN } from 'src/modules/users/domain/repositories/user/user.repository.tokens';
import { UsersModule } from 'src/modules/users/users.module';
import { AppointmentsModule } from '../../../../appointments/appointments.module';
import { APPOINTMENT_REPOSITORY_TOKEN } from '../../../../appointments/domain/repositories/appointment/appointment.repository.tokens';
import type { IAppointmentRepository } from '../../../../appointments/domain/repositories/appointment/i-appointment.repository';
import { ApproveMasterServiceReviewByIdUseCase } from '../../../application/use-cases/master-service-review/approve-master-service-review-by-id.use-case';
import { BlockMasterServiceReviewByIdUseCase } from '../../../application/use-cases/master-service-review/block-master-service-review-by-id.use-case';
import { CreateMasterServiceReviewUseCase } from '../../../application/use-cases/master-service-review/create-master-service-review.use-case';
import { DeleteMasterServiceReviewByIdUseCase } from '../../../application/use-cases/master-service-review/delete-master-service-review-by-id.use-case';
import { GetMasterServiceReviewByIdUseCase } from '../../../application/use-cases/master-service-review/get-master-service-review-by-id.use-case';
import { GetMasterServiceReviewsUseCase } from '../../../application/use-cases/master-service-review/get-master-service-reviews.use-case';
import { RecalculateMasterRatingsUseCase } from '../../../application/use-cases/master-service-review/recalculate-master-ratings.use-case';
import { UpdateMasterServiceReviewByIdUseCase } from '../../../application/use-cases/master-service-review/update-master-service-review-by-id.use-case';
import type { IMasterProfileRepository } from '../../../domain/repositories/master-profile/i-master-profile.repository';
import { MASTER_PROFILE_REPOSITORY_TOKEN } from '../../../domain/repositories/master-profile/master-profile.repository.tokens';
import type { IMasterServiceRepository } from '../../../domain/repositories/master-service/i-master-service.repository';
import { MASTER_SERVICE_REPOSITORY_TOKEN } from '../../../domain/repositories/master-service/master-service.repository.tokens';
import type { IMasterServiceReviewReactionRepository } from '../../../domain/repositories/master-service-review-reaction/i-master-service-review-reaction.repository';
import { MASTER_SERVICE_REVIEW_REACTION_REPOSITORY_TOKEN } from '../../../domain/repositories/master-service-review-reaction/master-service-review-reaction.repository.tokens';
import type { IMasterServiceReviewRepository } from '../../../domain/repositories/master-service-review/i-master-service-review.repository';
import { MASTER_SERVICE_REVIEW_REPOSITORY_TOKEN } from '../../../domain/repositories/master-service-review/master-service-review.repository.tokens';
import { PrismaMasterServiceReviewRepository } from '../../persistence/repositories/master-service-review/prisma-master-service-review.repository';
import { MasterProfileModule } from '../master-profile/master-profile.module';
import { MasterServiceModule } from '../master-service/master-service.module';
import { MasterServiceReviewReactionModule } from '../master-service-review-reaction/master-service-review-reaction.module';

@Module({
  imports: [
    forwardRef(() => AppointmentsModule),
    forwardRef(() => MasterServiceReviewReactionModule),
    forwardRef(() => MasterServiceModule),
    forwardRef(() => MasterProfileModule),
    UsersModule,
    NotificationsModule,
    WebPushSubscriptionsModule,
  ],
  providers: [
    {
      provide: MASTER_SERVICE_REVIEW_REPOSITORY_TOKEN,
      useClass: PrismaMasterServiceReviewRepository,
    },
    {
      provide: RecalculateMasterRatingsUseCase,
      useFactory: (
        reviewRepo: IMasterServiceReviewRepository,
        serviceRepo: IMasterServiceRepository,
        profileRepo: IMasterProfileRepository,
      ) =>
        new RecalculateMasterRatingsUseCase(
          reviewRepo,
          serviceRepo,
          profileRepo,
        ),
      inject: [
        MASTER_SERVICE_REVIEW_REPOSITORY_TOKEN,
        MASTER_SERVICE_REPOSITORY_TOKEN,
        MASTER_PROFILE_REPOSITORY_TOKEN,
      ],
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
        profileRepo: IMasterProfileRepository,
        userRepo: IUserRepository,
        createNotificationUseCase: CreateNotificationUseCase,
        sendWebPushToUserUseCase: SendWebPushToUserUseCase,
        notificationMessageCatalog: NotificationMessageCatalog,
      ) =>
        new CreateMasterServiceReviewUseCase(
          transactionManager,
          reviewRepo,
          appointmentRepo,
          profileRepo,
          userRepo,
          createNotificationUseCase,
          sendWebPushToUserUseCase,
          notificationMessageCatalog,
        ),
      inject: [
        TRANSACTION_MANAGER_TOKEN,
        MASTER_SERVICE_REVIEW_REPOSITORY_TOKEN,
        APPOINTMENT_REPOSITORY_TOKEN,
        MASTER_PROFILE_REPOSITORY_TOKEN,
        USER_REPOSITORY_TOKEN,
        CreateNotificationUseCase,
        SendWebPushToUserUseCase,
        NotificationMessageCatalog,
      ],
    },
    {
      provide: UpdateMasterServiceReviewByIdUseCase,
      useFactory: (
        transactionManager: ITransactionManager,
        reviewRepo: IMasterServiceReviewRepository,
        serviceRepo: IMasterServiceRepository,
        recalculateMasterRatingsUseCase: RecalculateMasterRatingsUseCase,
      ) =>
        new UpdateMasterServiceReviewByIdUseCase(
          transactionManager,
          reviewRepo,
          serviceRepo,
          recalculateMasterRatingsUseCase,
        ),
      inject: [
        TRANSACTION_MANAGER_TOKEN,
        MASTER_SERVICE_REVIEW_REPOSITORY_TOKEN,
        MASTER_SERVICE_REPOSITORY_TOKEN,
        RecalculateMasterRatingsUseCase,
      ],
    },
    {
      provide: DeleteMasterServiceReviewByIdUseCase,
      useFactory: (
        transactionManager: ITransactionManager,
        reviewRepo: IMasterServiceReviewRepository,
        serviceRepo: IMasterServiceRepository,
        recalculateMasterRatingsUseCase: RecalculateMasterRatingsUseCase,
      ) =>
        new DeleteMasterServiceReviewByIdUseCase(
          transactionManager,
          reviewRepo,
          serviceRepo,
          recalculateMasterRatingsUseCase,
        ),
      inject: [
        TRANSACTION_MANAGER_TOKEN,
        MASTER_SERVICE_REVIEW_REPOSITORY_TOKEN,
        MASTER_SERVICE_REPOSITORY_TOKEN,
        RecalculateMasterRatingsUseCase,
      ],
    },
    {
      provide: ApproveMasterServiceReviewByIdUseCase,
      useFactory: (
        transactionManager: ITransactionManager,
        reviewRepo: IMasterServiceReviewRepository,
        serviceRepo: IMasterServiceRepository,
        recalculateMasterRatingsUseCase: RecalculateMasterRatingsUseCase,
      ) =>
        new ApproveMasterServiceReviewByIdUseCase(
          transactionManager,
          reviewRepo,
          serviceRepo,
          recalculateMasterRatingsUseCase,
        ),
      inject: [
        TRANSACTION_MANAGER_TOKEN,
        MASTER_SERVICE_REVIEW_REPOSITORY_TOKEN,
        MASTER_SERVICE_REPOSITORY_TOKEN,
        RecalculateMasterRatingsUseCase,
      ],
    },
    {
      provide: BlockMasterServiceReviewByIdUseCase,
      useFactory: (
        transactionManager: ITransactionManager,
        reviewRepo: IMasterServiceReviewRepository,
        serviceRepo: IMasterServiceRepository,
        recalculateMasterRatingsUseCase: RecalculateMasterRatingsUseCase,
      ) =>
        new BlockMasterServiceReviewByIdUseCase(
          transactionManager,
          reviewRepo,
          serviceRepo,
          recalculateMasterRatingsUseCase,
        ),
      inject: [
        TRANSACTION_MANAGER_TOKEN,
        MASTER_SERVICE_REVIEW_REPOSITORY_TOKEN,
        MASTER_SERVICE_REPOSITORY_TOKEN,
        RecalculateMasterRatingsUseCase,
      ],
    },
  ],
  exports: [
    MASTER_SERVICE_REVIEW_REPOSITORY_TOKEN,
    GetMasterServiceReviewsUseCase,
    GetMasterServiceReviewByIdUseCase,
    CreateMasterServiceReviewUseCase,
    UpdateMasterServiceReviewByIdUseCase,
    DeleteMasterServiceReviewByIdUseCase,
    ApproveMasterServiceReviewByIdUseCase,
    BlockMasterServiceReviewByIdUseCase,
  ],
})
export class MasterServiceReviewModule {}

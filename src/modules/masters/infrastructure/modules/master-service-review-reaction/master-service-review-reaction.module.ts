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
import { DeleteMasterServiceReviewReactionByIdUseCase } from '../../../application/use-cases/master-service-review-reaction/delete-master-service-review-reaction-by-id.use-case';
import { GetMasterServiceReviewReactionsUseCase } from '../../../application/use-cases/master-service-review-reaction/get-master-service-review-reactions.use-case';
import { UpsertMasterServiceReviewReactionUseCase } from '../../../application/use-cases/master-service-review-reaction/upsert-master-service-review-reaction.use-case';
import type { IMasterServiceRepository } from '../../../domain/repositories/master-service/i-master-service.repository';
import { MASTER_SERVICE_REPOSITORY_TOKEN } from '../../../domain/repositories/master-service/master-service.repository.tokens';
import type { IMasterServiceReviewReactionRepository } from '../../../domain/repositories/master-service-review-reaction/i-master-service-review-reaction.repository';
import { MASTER_SERVICE_REVIEW_REACTION_REPOSITORY_TOKEN } from '../../../domain/repositories/master-service-review-reaction/master-service-review-reaction.repository.tokens';
import type { IMasterServiceReviewRepository } from '../../../domain/repositories/master-service-review/i-master-service-review.repository';
import { MASTER_SERVICE_REVIEW_REPOSITORY_TOKEN } from '../../../domain/repositories/master-service-review/master-service-review.repository.tokens';
import { PrismaMasterServiceReviewReactionRepository } from '../../persistence/repositories/master-service-review-reaction/prisma-master-service-review-reaction.repository';
import { MasterServiceModule } from '../master-service/master-service.module';
import { MasterServiceReviewModule } from '../master-service-review/master-service-review.module';

@Module({
  imports: [
    forwardRef(() => AppointmentsModule),
    forwardRef(() => MasterServiceReviewModule),
    forwardRef(() => MasterServiceModule),
    UsersModule,
    NotificationsModule,
    WebPushSubscriptionsModule,
  ],
  providers: [
    {
      provide: MASTER_SERVICE_REVIEW_REACTION_REPOSITORY_TOKEN,
      useClass: PrismaMasterServiceReviewReactionRepository,
    },
    {
      provide: GetMasterServiceReviewReactionsUseCase,
      useFactory: (repo: IMasterServiceReviewReactionRepository) =>
        new GetMasterServiceReviewReactionsUseCase(repo),
      inject: [MASTER_SERVICE_REVIEW_REACTION_REPOSITORY_TOKEN],
    },
    {
      provide: UpsertMasterServiceReviewReactionUseCase,
      useFactory: (
        transactionManager: ITransactionManager,
        reactionRepo: IMasterServiceReviewReactionRepository,
        reviewRepo: IMasterServiceReviewRepository,
        appointmentRepo: IAppointmentRepository,
        serviceRepo: IMasterServiceRepository,
        userRepo: IUserRepository,
        createNotificationUseCase: CreateNotificationUseCase,
        sendWebPushToUserUseCase: SendWebPushToUserUseCase,
        notificationMessageCatalog: NotificationMessageCatalog,
      ) =>
        new UpsertMasterServiceReviewReactionUseCase(
          transactionManager,
          reactionRepo,
          reviewRepo,
          appointmentRepo,
          serviceRepo,
          userRepo,
          createNotificationUseCase,
          sendWebPushToUserUseCase,
          notificationMessageCatalog,
        ),
      inject: [
        TRANSACTION_MANAGER_TOKEN,
        MASTER_SERVICE_REVIEW_REACTION_REPOSITORY_TOKEN,
        MASTER_SERVICE_REVIEW_REPOSITORY_TOKEN,
        APPOINTMENT_REPOSITORY_TOKEN,
        MASTER_SERVICE_REPOSITORY_TOKEN,
        USER_REPOSITORY_TOKEN,
        CreateNotificationUseCase,
        SendWebPushToUserUseCase,
        NotificationMessageCatalog,
      ],
    },
    {
      provide: DeleteMasterServiceReviewReactionByIdUseCase,
      useFactory: (
        transactionManager: ITransactionManager,
        reactionRepo: IMasterServiceReviewReactionRepository,
      ) =>
        new DeleteMasterServiceReviewReactionByIdUseCase(
          transactionManager,
          reactionRepo,
        ),
      inject: [
        TRANSACTION_MANAGER_TOKEN,
        MASTER_SERVICE_REVIEW_REACTION_REPOSITORY_TOKEN,
      ],
    },
  ],
  exports: [
    MASTER_SERVICE_REVIEW_REACTION_REPOSITORY_TOKEN,
    GetMasterServiceReviewReactionsUseCase,
    UpsertMasterServiceReviewReactionUseCase,
    DeleteMasterServiceReviewReactionByIdUseCase,
  ],
})
export class MasterServiceReviewReactionModule {}

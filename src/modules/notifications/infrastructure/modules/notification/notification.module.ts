import { Module } from '@nestjs/common';
import {
  TRANSACTION_MANAGER_TOKEN,
  type ITransactionManager,
} from '@shared/domain/transactions';
import type { INotificationRealtimePublisher } from 'src/modules/notifications/application/ports/i-notification-realtime.publisher';
import { NOTIFICATION_REALTIME_PUBLISHER_TOKEN } from 'src/modules/notifications/application/ports/notification-realtime.publisher.tokens';
import { ArchiveNotificationByIdUseCase } from 'src/modules/notifications/application/use-cases/notification/archive-notification-by-id.use-case';
import { CreateNotificationUseCase } from 'src/modules/notifications/application/use-cases/notification/create-notification.use-case';
import { DeleteNotificationByIdUseCase } from 'src/modules/notifications/application/use-cases/notification/delete-notification-by-id.use-case';
import { GetNotificationByIdUseCase } from 'src/modules/notifications/application/use-cases/notification/get-notification-by-id.use-case';
import { GetNotificationsUseCase } from 'src/modules/notifications/application/use-cases/notification/get-notifications.use-case';
import { GetUnreadNotificationsCountUseCase } from 'src/modules/notifications/application/use-cases/notification/get-unread-notifications-count.use-case';
import { MarkAllNotificationsReadUseCase } from 'src/modules/notifications/application/use-cases/notification/mark-all-notifications-read.use-case';
import { MarkNotificationReadByIdUseCase } from 'src/modules/notifications/application/use-cases/notification/mark-notification-read-by-id.use-case';
import {
  NOTIFICATION_REPOSITORY_TOKEN,
  type INotificationRepository,
} from 'src/modules/notifications/domain/repositories/notification';
import { PrismaNotificationRepository } from '../../persistence/repositories/notification/prisma-notification.repository';
import { NotificationSseEventBus } from '../../sse/notification-sse.event-bus';
import { RxjsNotificationRealtimePublisher } from '../../sse/rxjs-notification-realtime.publisher';
import { NotificationMessageCatalog } from '../../i18n/notification-message-catalog';

@Module({
  providers: [
    NotificationMessageCatalog,
    {
      provide: NOTIFICATION_REPOSITORY_TOKEN,
      useClass: PrismaNotificationRepository,
    },
    NotificationSseEventBus,
    {
      provide: NOTIFICATION_REALTIME_PUBLISHER_TOKEN,
      useClass: RxjsNotificationRealtimePublisher,
    },
    {
      provide: CreateNotificationUseCase,
      useFactory: (
        transactionManager: ITransactionManager,
        repo: INotificationRepository,
        realtimePublisher: INotificationRealtimePublisher,
      ) =>
        new CreateNotificationUseCase(
          transactionManager,
          repo,
          realtimePublisher,
        ),
      inject: [
        TRANSACTION_MANAGER_TOKEN,
        NOTIFICATION_REPOSITORY_TOKEN,
        NOTIFICATION_REALTIME_PUBLISHER_TOKEN,
      ],
    },
    {
      provide: GetNotificationsUseCase,
      useFactory: (repo: INotificationRepository) =>
        new GetNotificationsUseCase(repo),
      inject: [NOTIFICATION_REPOSITORY_TOKEN],
    },
    {
      provide: GetNotificationByIdUseCase,
      useFactory: (repo: INotificationRepository) =>
        new GetNotificationByIdUseCase(repo),
      inject: [NOTIFICATION_REPOSITORY_TOKEN],
    },
    {
      provide: MarkNotificationReadByIdUseCase,
      useFactory: (
        transactionManager: ITransactionManager,
        repo: INotificationRepository,
      ) => new MarkNotificationReadByIdUseCase(transactionManager, repo),
      inject: [TRANSACTION_MANAGER_TOKEN, NOTIFICATION_REPOSITORY_TOKEN],
    },
    {
      provide: MarkAllNotificationsReadUseCase,
      useFactory: (
        transactionManager: ITransactionManager,
        repo: INotificationRepository,
      ) => new MarkAllNotificationsReadUseCase(transactionManager, repo),
      inject: [TRANSACTION_MANAGER_TOKEN, NOTIFICATION_REPOSITORY_TOKEN],
    },
    {
      provide: ArchiveNotificationByIdUseCase,
      useFactory: (
        transactionManager: ITransactionManager,
        repo: INotificationRepository,
      ) => new ArchiveNotificationByIdUseCase(transactionManager, repo),
      inject: [TRANSACTION_MANAGER_TOKEN, NOTIFICATION_REPOSITORY_TOKEN],
    },
    {
      provide: DeleteNotificationByIdUseCase,
      useFactory: (
        transactionManager: ITransactionManager,
        repo: INotificationRepository,
      ) => new DeleteNotificationByIdUseCase(transactionManager, repo),
      inject: [TRANSACTION_MANAGER_TOKEN, NOTIFICATION_REPOSITORY_TOKEN],
    },
    {
      provide: GetUnreadNotificationsCountUseCase,
      useFactory: (repo: INotificationRepository) =>
        new GetUnreadNotificationsCountUseCase(repo),
      inject: [NOTIFICATION_REPOSITORY_TOKEN],
    },
  ],
  exports: [
    NotificationMessageCatalog,
    NOTIFICATION_REPOSITORY_TOKEN,
    NOTIFICATION_REALTIME_PUBLISHER_TOKEN,
    NotificationSseEventBus,
    CreateNotificationUseCase,
    GetNotificationsUseCase,
    GetNotificationByIdUseCase,
    MarkNotificationReadByIdUseCase,
    MarkAllNotificationsReadUseCase,
    ArchiveNotificationByIdUseCase,
    DeleteNotificationByIdUseCase,
    GetUnreadNotificationsCountUseCase,
  ],
})
export class NotificationModule {}

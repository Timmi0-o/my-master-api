import type { ITransactionManager } from '@shared/domain/transactions';
import type { INotificationRepository } from 'src/modules/notifications/domain/repositories/notification';
import type { IMarkAllNotificationsReadApplicationInput } from '../../dtos/notification/mark-all-notifications-read.input';
import type { IMarkAllNotificationsReadApplicationOutput } from '../../dtos/notification/mark-all-notifications-read.output';

export class MarkAllNotificationsReadUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async execute(
    input: IMarkAllNotificationsReadApplicationInput,
  ): Promise<IMarkAllNotificationsReadApplicationOutput> {
    const updatedCount = await this.transactionManager.runInTransaction(
      (scope) =>
        this.notificationRepository.markAllReadByUserId(
          input.actor.userId,
          scope,
        ),
    );

    return { updatedCount };
  }
}

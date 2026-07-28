import type { ITransactionManager } from '@shared/domain/transactions';
import {
  ensureNotificationExists,
  ensureNotificationModifiable,
} from 'src/modules/notifications/domain/entities/notification';
import type { INotificationRepository } from 'src/modules/notifications/domain/repositories/notification';
import type { IMarkNotificationReadApplicationInput } from '../../dtos/notification/mark-notification-read.input';
import type { IMarkNotificationReadApplicationOutput } from '../../dtos/notification/mark-notification-read.output';

export class MarkNotificationReadByIdUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async execute(
    input: IMarkNotificationReadApplicationInput,
  ): Promise<IMarkNotificationReadApplicationOutput> {
    const existing = await this.notificationRepository.findEntityById(input.id);
    ensureNotificationExists(existing, input.id);
    ensureNotificationModifiable(existing, input.actor);

    if (existing.readAt != null) {
      return existing;
    }

    return this.transactionManager.runInTransaction((scope) =>
      this.notificationRepository.update(
        input.id,
        { readAt: new Date() },
        scope,
      ),
    );
  }
}

import type { ITransactionManager } from '@shared/domain/transactions';
import {
  ensureNotificationExists,
  ensureNotificationModifiable,
} from 'src/modules/notifications/domain/entities/notification';
import type { INotificationRepository } from 'src/modules/notifications/domain/repositories/notification';
import type { IArchiveNotificationApplicationInput } from '../../dtos/notification/archive-notification.input';
import type { IArchiveNotificationApplicationOutput } from '../../dtos/notification/archive-notification.output';

export class ArchiveNotificationByIdUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async execute(
    input: IArchiveNotificationApplicationInput,
  ): Promise<IArchiveNotificationApplicationOutput> {
    const existing = await this.notificationRepository.findEntityById(input.id);
    ensureNotificationExists(existing, input.id);
    ensureNotificationModifiable(existing, input.actor);

    if (existing.archivedAt != null) {
      return existing;
    }

    return this.transactionManager.runInTransaction((scope) =>
      this.notificationRepository.update(
        input.id,
        {
          archivedAt: new Date(),
          readAt: existing.readAt ?? new Date(),
        },
        scope,
      ),
    );
  }
}

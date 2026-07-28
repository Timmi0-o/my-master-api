import type { ITransactionManager } from '@shared/domain/transactions';
import {
  ensureNotificationExists,
  ensureNotificationModifiable,
} from 'src/modules/notifications/domain/entities/notification';
import type { INotificationRepository } from 'src/modules/notifications/domain/repositories/notification';
import type { IDeleteNotificationApplicationInput } from '../../dtos/notification/delete-notification.input';
import type { IDeleteNotificationApplicationOutput } from '../../dtos/notification/delete-notification.output';

export class DeleteNotificationByIdUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async execute(
    input: IDeleteNotificationApplicationInput,
  ): Promise<IDeleteNotificationApplicationOutput> {
    const existing = await this.notificationRepository.findEntityById(input.id);
    ensureNotificationExists(existing, input.id);
    ensureNotificationModifiable(existing, input.actor);

    return this.transactionManager.runInTransaction((scope) =>
      this.notificationRepository.softDelete(input.id, scope),
    );
  }
}

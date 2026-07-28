import type { ITransactionManager } from '@shared/domain/transactions';
import type { INotificationRealtimePublisher } from 'src/modules/notifications/application/ports/i-notification-realtime.publisher';
import {
  NotificationAlreadyExistsError,
  type ICreateNotificationInput,
} from 'src/modules/notifications/domain/entities/notification';
import type { INotificationRepository } from 'src/modules/notifications/domain/repositories/notification';
import type { ICreateNotificationApplicationInput } from '../../dtos/notification/create-notification.input';
import type { ICreateNotificationApplicationOutput } from '../../dtos/notification/create-notification.output';

export class CreateNotificationUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly notificationRepository: INotificationRepository,
    private readonly realtimePublisher: INotificationRealtimePublisher,
  ) {}

  async execute(
    input: ICreateNotificationApplicationInput,
  ): Promise<ICreateNotificationApplicationOutput> {
    const createInput: ICreateNotificationInput = {
      userId: input.userId,
      actorUserId: input.actorUserId ?? null,
      category: input.category,
      type: input.type,
      title: input.title,
      body: input.body,
      actionUrl: input.actionUrl ?? null,
      relatedEntityType: input.relatedEntityType ?? null,
      relatedEntityId: input.relatedEntityId ?? null,
      payload: input.payload ?? null,
      idempotencyKey: input.idempotencyKey ?? null,
    };

    let created = false;

    const notification = await this.transactionManager.runInTransaction(
      async (scope) => {
        if (createInput.idempotencyKey) {
          const existing =
            await this.notificationRepository.findEntityByUserAndIdempotencyKey(
              createInput.userId,
              createInput.idempotencyKey,
              scope,
            );

          if (existing && existing.deletedAt == null) {
            return existing;
          }
        }

        try {
          const entity = await this.notificationRepository.create(
            createInput,
            scope,
          );
          created = true;
          return entity;
        } catch (error) {
          if (
            error instanceof NotificationAlreadyExistsError &&
            createInput.idempotencyKey
          ) {
            const raced =
              await this.notificationRepository.findEntityByUserAndIdempotencyKey(
                createInput.userId,
                createInput.idempotencyKey,
                scope,
              );
            if (raced && raced.deletedAt == null) {
              return raced;
            }
          }

          throw error;
        }
      },
    );

    if (created) {
      await this.realtimePublisher.notificationCreated(notification);
    }

    return notification;
  }
}

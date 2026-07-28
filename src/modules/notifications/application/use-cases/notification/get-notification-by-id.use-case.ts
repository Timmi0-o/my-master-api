import {
  NotificationForbiddenError,
  NotificationNotFoundError,
} from 'src/modules/notifications/domain/entities/notification';
import type { INotificationRepository } from 'src/modules/notifications/domain/repositories/notification';
import type { IGetNotificationByIdApplicationInput } from '../../dtos/notification/get-notification-by-id.input';
import type { IGetNotificationByIdApplicationOutput } from '../../dtos/notification/get-notification-by-id.output';

export class GetNotificationByIdUseCase {
  constructor(
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async execute(
    input: IGetNotificationByIdApplicationInput,
  ): Promise<IGetNotificationByIdApplicationOutput> {
    const entity = await this.notificationRepository.findEntityById(input.id);
    if (!entity || (!input.isStaffUser && entity.deletedAt != null)) {
      throw new NotificationNotFoundError(input.id);
    }

    if (!input.isStaffUser && entity.userId !== input.actorUserId) {
      throw new NotificationForbiddenError(input.id);
    }

    const item = await this.notificationRepository.findOne(
      input.id,
      input.params,
    );
    if (!item) {
      throw new NotificationNotFoundError(input.id);
    }

    return item;
  }
}

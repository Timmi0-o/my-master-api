import type { INotificationRepository } from 'src/modules/notifications/domain/repositories/notification';
import type { IGetUnreadNotificationsCountApplicationInput } from '../../dtos/notification/get-unread-notifications-count.input';
import type { IGetUnreadNotificationsCountApplicationOutput } from '../../dtos/notification/get-unread-notifications-count.output';

export class GetUnreadNotificationsCountUseCase {
  constructor(
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async execute(
    input: IGetUnreadNotificationsCountApplicationInput,
  ): Promise<IGetUnreadNotificationsCountApplicationOutput> {
    const count = await this.notificationRepository.countUnreadByUserId(
      input.actor.userId,
    );

    return { count };
  }
}

import type { FindManyParams } from 'src/modules/shared/domain/query';
import type {
  INotificationPublicEntity,
  INotificationRelations,
} from 'src/modules/notifications/domain/entities/notification';
import type { INotificationRepository } from 'src/modules/notifications/domain/repositories/notification';
import type { GetNotificationsOutput } from '../../dtos/notification/get-notifications.output';

export class GetNotificationsUseCase {
  constructor(
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async execute(
    params: FindManyParams<INotificationPublicEntity, INotificationRelations>,
  ): Promise<GetNotificationsOutput> {
    const [items, total] = await Promise.all([
      this.notificationRepository.findMany(params),
      this.notificationRepository.count({ where: params.where }),
    ]);

    return { items, total };
  }
}

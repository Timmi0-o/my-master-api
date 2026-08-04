import { enrichNotificationActorAvatars } from 'src/modules/notifications/application/helpers/enrich-notification-actor-avatars.helper';
import type {
  INotificationPublicEntity,
  INotificationRelations,
} from 'src/modules/notifications/domain/entities/notification';
import type { INotificationRepository } from 'src/modules/notifications/domain/repositories/notification';
import type { IImageRepository } from 'src/modules/masters/domain/repositories/image/i-image.repository';
import { applyReadEnrichments } from 'src/modules/shared/application/enrichment/apply-read-enrichments';
import type { FindManyParams } from 'src/modules/shared/domain/query';
import type { GetNotificationsOutput } from '../../dtos/notification/get-notifications.output';

type NotificationEnrichContext = {
  enrich?: FindManyParams<
    INotificationPublicEntity,
    INotificationRelations
  >['enrich'];
};

export class GetNotificationsUseCase {
  constructor(
    private readonly notificationRepository: INotificationRepository,
    private readonly imageRepository: IImageRepository,
  ) {}

  async execute(
    params: FindManyParams<INotificationPublicEntity, INotificationRelations>,
  ): Promise<GetNotificationsOutput> {
    const [items, total] = await Promise.all([
      this.notificationRepository.findMany(params),
      this.notificationRepository.count({ where: params.where }),
    ]);

    const enriched = await applyReadEnrichments<
      (typeof items)[number],
      NotificationEnrichContext
    >(items, { enrich: params.enrich }, [
      {
        when: (ctx) => Boolean(ctx.enrich?.profileAvatars),
        apply: (current) =>
          enrichNotificationActorAvatars(this.imageRepository, current),
      },
    ]);

    return { items: enriched, total };
  }
}

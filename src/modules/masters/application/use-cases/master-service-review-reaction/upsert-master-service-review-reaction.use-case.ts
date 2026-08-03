import { SendWebPushToUserUseCase } from '@modules/web-push-subscriptions/application/use-cases/web-push-subscription/send-web-push-to-user.use-case';
import type { ITransactionManager } from '@shared/domain/transactions';
import type { IAppointmentRepository } from 'src/modules/appointments/domain/repositories/appointment/i-appointment.repository';
import { ensureMasterServiceReviewExists } from 'src/modules/masters/domain/entities/master-service-review';
import {
  EMasterServiceReviewReactionType,
  ensureActorOrderedMasterService,
  ensureMasterServiceReviewReactionExists,
  type ICreateMasterServiceReviewReactionInput,
} from 'src/modules/masters/domain/entities/master-service-review-reaction';
import type { IMasterServiceReviewReactionRepository } from 'src/modules/masters/domain/repositories/master-service-review-reaction/i-master-service-review-reaction.repository';
import type { IMasterServiceReviewRepository } from 'src/modules/masters/domain/repositories/master-service-review/i-master-service-review.repository';
import type { IMasterServiceRepository } from 'src/modules/masters/domain/repositories/master-service/i-master-service.repository';
import type { CreateNotificationUseCase } from 'src/modules/notifications/application/use-cases/notification/create-notification.use-case';
import {
  NotificationCategory,
  NotificationRelatedEntityType,
  NotificationType,
} from 'src/modules/notifications/domain/entities/notification';
import type { NotificationMessageCatalog } from 'src/modules/notifications/infrastructure/i18n/notification-message-catalog';
import { EUserLanguage } from 'src/modules/users/domain/entities/user';
import type { IUserRepository } from 'src/modules/users/domain/repositories/user/i-user.repository';
import type { IUpsertMasterServiceReviewReactionApplicationInput } from '../../dtos/master-service-review-reaction/upsert-master-service-review-reaction.input';
import type { IUpsertMasterServiceReviewReactionApplicationOutput } from '../../dtos/master-service-review-reaction/upsert-master-service-review-reaction.output';

export class UpsertMasterServiceReviewReactionUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly reactionRepository: IMasterServiceReviewReactionRepository,
    private readonly reviewRepository: IMasterServiceReviewRepository,
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly masterServiceRepository: IMasterServiceRepository,
    private readonly userRepository: IUserRepository,
    private readonly createNotificationUseCase: CreateNotificationUseCase,
    private readonly sendWebPushToUserUseCase: SendWebPushToUserUseCase,
    private readonly notificationMessageCatalog: NotificationMessageCatalog,
  ) {}

  async execute(
    input: IUpsertMasterServiceReviewReactionApplicationInput,
  ): Promise<IUpsertMasterServiceReviewReactionApplicationOutput> {
    const review = await this.reviewRepository.findEntityById(
      input.masterServiceReviewId,
    );
    ensureMasterServiceReviewExists(review, input.masterServiceReviewId);

    const hasOrderedService =
      await this.appointmentRepository.existsByClientUserIdAndMasterServiceId(
        input.actor.userId,
        review.masterServiceId,
      );
    ensureActorOrderedMasterService(hasOrderedService, review.masterServiceId);

    const existing = await this.reactionRepository.findEntityByUserAndReviewId(
      input.actor.userId,
      input.masterServiceReviewId,
    );

    let reaction: IUpsertMasterServiceReviewReactionApplicationOutput = null;
    let shouldNotify = false;

    if (!existing) {
      const createInput: ICreateMasterServiceReviewReactionInput = {
        userId: input.actor.userId,
        masterServiceReviewId: input.masterServiceReviewId,
        type: input.type,
      };

      reaction = await this.transactionManager.runInTransaction((scope) =>
        this.reactionRepository.create(createInput, scope),
      );
      shouldNotify = true;
    } else if (existing.deletedAt != null) {
      reaction = await this.transactionManager.runInTransaction(
        async (scope) => {
          await this.reactionRepository.restore(existing.id, scope);
          if (existing.type !== input.type) {
            return this.reactionRepository.update(
              existing.id,
              { type: input.type },
              scope,
            );
          }
          const restored = await this.reactionRepository.findEntityById(
            existing.id,
            scope,
          );
          ensureMasterServiceReviewReactionExists(restored, existing.id);
          return restored;
        },
      );
      shouldNotify = true;
    } else if (existing.type === input.type) {
      await this.transactionManager.runInTransaction((scope) =>
        this.reactionRepository.softDelete(existing.id, scope),
      );
      return null;
    } else {
      reaction = await this.transactionManager.runInTransaction((scope) =>
        this.reactionRepository.update(
          existing.id,
          { type: input.type },
          scope,
        ),
      );
      shouldNotify = true;
    }

    if (shouldNotify && reaction && reaction.userId !== review.clientUserId) {
      await this.notifyReviewAuthor({
        reviewId: review.id,
        reviewAuthorUserId: review.clientUserId,
        actorUserId: input.actor.userId,
        masterServiceId: review.masterServiceId,
        reactionType: reaction.type,
      });
    }

    return reaction;
  }

  private async notifyReviewAuthor(input: {
    reviewId: string;
    reviewAuthorUserId: string;
    actorUserId: string;
    masterServiceId: string;
    reactionType: EMasterServiceReviewReactionType;
  }): Promise<void> {
    const service = await this.masterServiceRepository.findEntityById(
      input.masterServiceId,
    );
    const recipient = await this.userRepository.findEntityById(
      input.reviewAuthorUserId,
    );

    const reactionLabel =
      input.reactionType === EMasterServiceReviewReactionType.LIKE
        ? recipient?.language === EUserLanguage.EN
          ? 'liked'
          : 'лайк'
        : recipient?.language === EUserLanguage.EN
          ? 'disliked'
          : 'дизлайк';

    const { title, body } = this.notificationMessageCatalog.resolve(
      recipient?.language ?? EUserLanguage.RU,
      {
        type: NotificationType.REVIEW_REACTION,
        serviceName: service?.name ?? input.masterServiceId,
        reactionLabel,
      },
    );

    const actionUrl = `/master-service/${input.masterServiceId}`;
    const payload = {
      type: 'review_reaction',
      reviewId: input.reviewId,
      masterServiceId: input.masterServiceId,
      reactionType: input.reactionType,
      url: actionUrl,
    };

    void this.createNotificationUseCase
      .execute({
        userId: input.reviewAuthorUserId,
        actorUserId: input.actorUserId,
        category: NotificationCategory.REVIEW,
        type: NotificationType.REVIEW_REACTION,
        title,
        body,
        actionUrl,
        relatedEntityType: NotificationRelatedEntityType.MASTER_SERVICE_REVIEW,
        relatedEntityId: input.reviewId,
        payload,
        idempotencyKey: `review_reaction:${input.reviewId}:${input.actorUserId}:${input.reactionType}`,
      })
      .catch(() => undefined);

    void this.sendWebPushToUserUseCase.execute({
      userId: input.reviewAuthorUserId,
      title,
      body,
      data: payload,
    });
  }
}

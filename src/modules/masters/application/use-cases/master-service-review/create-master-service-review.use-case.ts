import { ensureAppointmentExists } from 'src/modules/appointments/domain/entities/appointment';
import type { IAppointmentRepository } from 'src/modules/appointments/domain/repositories/appointment/i-appointment.repository';
import type { ICreateMasterServiceReviewInput } from 'src/modules/masters/domain/entities/master-service-review';
import {
  ensureAppointmentReviewable,
  ensureValidReviewRating,
} from 'src/modules/masters/domain/entities/master-service-review';
import {
  ensureMasterProfileExists,
} from 'src/modules/masters/domain/entities/master-profile';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import type { IMasterServiceReviewRepository } from 'src/modules/masters/domain/repositories/master-service-review/i-master-service-review.repository';
import type { CreateNotificationUseCase } from 'src/modules/notifications/application/use-cases/notification/create-notification.use-case';
import {
  NotificationCategory,
  NotificationRelatedEntityType,
  NotificationType,
} from 'src/modules/notifications/domain/entities/notification';
import type { NotificationMessageCatalog } from 'src/modules/notifications/infrastructure/i18n/notification-message-catalog';
import { SendWebPushToUserUseCase } from '@modules/web-push-subscriptions/application/use-cases/web-push-subscription/send-web-push-to-user.use-case';
import type { ITransactionManager } from '@shared/domain/transactions';
import { EUserLanguage } from 'src/modules/users/domain/entities/user';
import type { IUserRepository } from 'src/modules/users/domain/repositories/user/i-user.repository';
import type { ICreateMasterServiceReviewApplicationInput } from '../../dtos/master-service-review/create-master-service-review.input';
import type { ICreateMasterServiceReviewApplicationOutput } from '../../dtos/master-service-review/create-master-service-review.output';
import type { RecalculateMasterRatingsUseCase } from './recalculate-master-ratings.use-case';

export class CreateMasterServiceReviewUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly masterServiceReviewRepository: IMasterServiceReviewRepository,
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
    private readonly userRepository: IUserRepository,
    private readonly recalculateMasterRatingsUseCase: RecalculateMasterRatingsUseCase,
    private readonly createNotificationUseCase: CreateNotificationUseCase,
    private readonly sendWebPushToUserUseCase: SendWebPushToUserUseCase,
    private readonly notificationMessageCatalog: NotificationMessageCatalog,
  ) {}

  async execute(
    input: ICreateMasterServiceReviewApplicationInput,
  ): Promise<ICreateMasterServiceReviewApplicationOutput> {
    ensureValidReviewRating(input.rating);

    const appointment = await this.appointmentRepository.findEntityById(
      input.appointmentId,
    );
    ensureAppointmentExists(appointment, input.appointmentId);

    const existingReview =
      await this.masterServiceReviewRepository.findEntityByAppointmentId(
        input.appointmentId,
      );
    ensureAppointmentReviewable(appointment, input.actor, existingReview);

    const profile = await this.masterProfileRepository.findEntityById(
      appointment.masterProfileId,
    );
    ensureMasterProfileExists(profile, appointment.masterProfileId);

    const createInput: ICreateMasterServiceReviewInput = {
      clientUserId: appointment.clientUserId,
      masterServiceId: appointment.masterServiceId,
      appointmentId: appointment.id,
      rating: input.rating,
      text: input.text,
    };

    const review = await this.transactionManager.runInTransaction(
      async (scope) => {
        const created = await this.masterServiceReviewRepository.create(
          createInput,
          scope,
        );

        await this.recalculateMasterRatingsUseCase.execute({
          masterServiceId: appointment.masterServiceId,
          masterProfileId: appointment.masterProfileId,
          scope,
        });

        return created;
      },
    );

    const recipient = await this.userRepository.findEntityById(profile.userId);
    const { title, body } = this.notificationMessageCatalog.resolve(
      recipient?.language ?? EUserLanguage.RU,
      {
        type: NotificationType.REVIEW_CREATED,
        serviceName: appointment.serviceName,
        rating: review.rating,
      },
    );

    const actionUrl = `/master-service/${appointment.masterServiceId}`;
    const payload = {
      type: 'review_created',
      reviewId: review.id,
      appointmentId: appointment.id,
      masterServiceId: appointment.masterServiceId,
      url: actionUrl,
    };

    void this.createNotificationUseCase
      .execute({
        userId: profile.userId,
        actorUserId: appointment.clientUserId,
        category: NotificationCategory.REVIEW,
        type: NotificationType.REVIEW_CREATED,
        title,
        body,
        actionUrl,
        relatedEntityType: NotificationRelatedEntityType.MASTER_SERVICE_REVIEW,
        relatedEntityId: review.id,
        payload,
        idempotencyKey: `review_created:${review.id}`,
      })
      .catch(() => undefined);

    void this.sendWebPushToUserUseCase.execute({
      userId: profile.userId,
      title,
      body,
      data: payload,
    });

    return review;
  }
}

import { SendWebPushToUserUseCase } from '@modules/web-push-subscriptions/application/use-cases/web-push-subscription/send-web-push-to-user.use-case';
import type { ITransactionManager } from '@shared/domain/transactions';
import type { ICreateAppointmentInput } from 'src/modules/appointments/domain/entities/appointment';
import { AppointmentNotAvailableError } from 'src/modules/appointments/domain/entities/appointment';
import type { ICreateAppointmentChatInput } from 'src/modules/appointments/domain/entities/appointment-chat';
import type { ICreateAppointmentChatMessageInput } from 'src/modules/appointments/domain/entities/appointment-chat-message';
import { EAppointmentChatMessageActor } from 'src/modules/appointments/domain/entities/appointment-chat-message';
import { EAppointmentStatus } from 'src/modules/appointments/domain/entities/appointment/appointment.enum';
import { ensureMasterProfileIsDifferent } from 'src/modules/appointments/domain/entities/appointment/policies/ensure-master-profile-is-different.policy';
import type { IAppointmentChatMessageRepository } from 'src/modules/appointments/domain/repositories/appointment-chat-message/i-appointment-chat-message.repository';
import type { IAppointmentChatRepository } from 'src/modules/appointments/domain/repositories/appointment-chat/i-appointment-chat.repository';
import type { IAppointmentRepository } from 'src/modules/appointments/domain/repositories/appointment/i-appointment.repository';
import { ensureMasterProfileExists } from 'src/modules/masters/domain/entities/master-profile';
import { MasterServiceNotFoundError } from 'src/modules/masters/domain/entities/master-service';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import type { IMasterServiceRepository } from 'src/modules/masters/domain/repositories/master-service/i-master-service.repository';
import type { CreateNotificationUseCase } from 'src/modules/notifications/application/use-cases/notification/create-notification.use-case';
import {
  NotificationCategory,
  NotificationRelatedEntityType,
  NotificationType,
} from 'src/modules/notifications/domain/entities/notification';
import { ensureUsersNotBlocked } from 'src/modules/users/domain/entities/user-block';
import type { IUserBlockRepository } from 'src/modules/users/domain/repositories/user-block/i-user-block.repository';
import type { ICreateAppointmentApplicationInput } from '../../dtos/appointment/create-appointment.input';
import type { ICreateAppointmentApplicationOutput } from '../../dtos/appointment/create-appointment.output';
import { IAppointmentRealtimePublisher } from '../../ports/appointment/i-appointment-realtime.publisher';

export class CreateAppointmentUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly appointmentChatRepository: IAppointmentChatRepository,
    private readonly appointmentChatMessageRepository: IAppointmentChatMessageRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
    private readonly masterServiceRepository: IMasterServiceRepository,
    private readonly userBlockRepository: IUserBlockRepository,
    private readonly realtimeAppointmentPublisher: IAppointmentRealtimePublisher,
    private readonly createNotificationUseCase: CreateNotificationUseCase,
    private readonly sendWebPushToUserUseCase: SendWebPushToUserUseCase,
  ) {}

  async execute(
    input: ICreateAppointmentApplicationInput,
  ): Promise<ICreateAppointmentApplicationOutput> {
    const clientUserId =
      input.actor.isStaffUser && input.clientUserId
        ? input.clientUserId
        : input.actor.userId;

    const profile = await this.masterProfileRepository.findEntityById(
      input.masterProfileId,
    );

    ensureMasterProfileExists(profile, input.masterProfileId);

    ensureMasterProfileIsDifferent(profile, input.actor);

    await ensureUsersNotBlocked(
      this.userBlockRepository,
      clientUserId,
      profile.userId,
    );

    const service = await this.masterServiceRepository.findEntityById(
      input.masterServiceId,
    );

    if (!service || service.masterProfileId !== input.masterProfileId) {
      throw new MasterServiceNotFoundError(input.masterServiceId);
    }

    const isAvailableSlot =
      (
        await this.appointmentRepository.findMany({
          where: {
            masterProfileId: input.masterProfileId,
            masterServiceId: input.masterServiceId,
            startsAt: input.startsAt,
          },
        })
      )?.length === 0;

    if (!isAvailableSlot) {
      throw new AppointmentNotAvailableError(input.startsAt);
    }

    const appointment = await this.transactionManager.runInTransaction(
      async (scope) => {
        const existingChat =
          await this.appointmentChatRepository.findEntityByMasterProfileAndClient(
            input.masterProfileId,
            clientUserId,
            scope,
          );

        const chatInput: ICreateAppointmentChatInput = {
          masterProfileId: input.masterProfileId,
          clientUserId,
        };
        const chat =
          existingChat ??
          (await this.appointmentChatRepository.create(chatInput, scope));

        const createInput: ICreateAppointmentInput = {
          masterProfileId: input.masterProfileId,
          masterServiceId: input.masterServiceId,
          clientUserId,
          chatId: chat.id,
          startsAt: input.startsAt,
          durationMinutes: service.durationMinutes,
          status: input.status ?? EAppointmentStatus.PENDING,
          totalPrice: service.price,
          serviceName: service.name,
          cancelledAt: null,
          cancelledBy: null,
          cancelReason: null,
          isEarlyCompletionByMaster: false,
          isEarlyCompletionByClient: false,
        };

        const created = await this.appointmentRepository.create(
          createInput,
          scope,
        );

        const systemMessageInput: ICreateAppointmentChatMessageInput = {
          chatId: chat.id,
          senderUserId: null,
          actor: EAppointmentChatMessageActor.SYSTEM,
          body: `Услуга ${service.name} создана`,
        };
        await this.appointmentChatMessageRepository.create(
          systemMessageInput,
          scope,
        );

        if (input.initialMessage) {
          const messageInput: ICreateAppointmentChatMessageInput = {
            chatId: chat.id,
            senderUserId: input.actor.userId,
            actor: EAppointmentChatMessageActor.USER,
            body: input.initialMessage.body,
          };
          await this.appointmentChatMessageRepository.create(
            messageInput,
            scope,
          );
        }

        await this.realtimeAppointmentPublisher.appointmentCreated(created, {
          recipientUserId: profile.userId,
        });

        return created;
      },
    );

    const today = new Date().toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    const title = 'У вас новая запись';
    const body = `Новая запись от ${today}`;
    const actionUrl = '/appointments';
    const payload = {
      type: 'appointment_created',
      appointmentId: appointment.id,
      url: actionUrl,
    };

    void this.createNotificationUseCase
      .execute({
        userId: profile.userId,
        actorUserId: clientUserId,
        category: NotificationCategory.APPOINTMENT,
        type: NotificationType.APPOINTMENT_CREATED,
        title,
        body,
        actionUrl,
        relatedEntityType: NotificationRelatedEntityType.APPOINTMENT,
        relatedEntityId: appointment.id,
        payload,
        idempotencyKey: `appointment_created:${appointment.id}`,
      })
      .catch(() => undefined);

    void this.sendWebPushToUserUseCase.execute({
      userId: profile.userId,
      title,
      body,
      data: payload,
    });

    return appointment;
  }
}

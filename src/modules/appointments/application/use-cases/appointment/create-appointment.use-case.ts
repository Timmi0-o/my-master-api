import { SendWebPushToUserUseCase } from '@modules/web-push-subscriptions/application/use-cases/web-push-subscription/send-web-push-to-user.use-case';
import type { ITransactionManager } from '@shared/domain/transactions';
import { addDays } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import type { ICreateAppointmentInput } from 'src/modules/appointments/domain/entities/appointment';
import {
  AppointmentNotAvailableError,
  type IAppointmentPublicEntity,
} from 'src/modules/appointments/domain/entities/appointment';
import type { ICreateAppointmentChatInput } from 'src/modules/appointments/domain/entities/appointment-chat';
import type { ICreateAppointmentChatMessageInput } from 'src/modules/appointments/domain/entities/appointment-chat-message';
import {
  EAppointmentChatMessageActor,
  EAppointmentChatSystemAction,
} from 'src/modules/appointments/domain/entities/appointment-chat-message';
import { EAppointmentStatus } from 'src/modules/appointments/domain/entities/appointment/appointment.enum';
import { ensureMasterProfileIsDifferent } from 'src/modules/appointments/domain/entities/appointment/policies/ensure-master-profile-is-different.policy';
import type { IAppointmentChatMessageRepository } from 'src/modules/appointments/domain/repositories/appointment-chat-message/i-appointment-chat-message.repository';
import type { IAppointmentChatRepository } from 'src/modules/appointments/domain/repositories/appointment-chat/i-appointment-chat.repository';
import type { IAppointmentRepository } from 'src/modules/appointments/domain/repositories/appointment/i-appointment.repository';
import {
  getLocalDayBoundsUtc,
  isMasterStartsAtAvailable,
} from 'src/modules/masters/application/services/calculate-master-available-slots';
import {
  ensureMasterOwnerEmailVerified,
  ensureMasterProfileExists,
} from 'src/modules/masters/domain/entities/master-profile';
import type { IMasterScheduleExceptionPublicEntity } from 'src/modules/masters/domain/entities/master-schedule-exception';
import {
  ensureMasterServiceBookable,
  MasterServiceNotFoundError,
} from 'src/modules/masters/domain/entities/master-service';
import type { IMasterWeeklySchedulePublicEntity } from 'src/modules/masters/domain/entities/master-weekly-schedule';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import type { IMasterScheduleExceptionRepository } from 'src/modules/masters/domain/repositories/master-schedule-exception/i-master-schedule-exception.repository';
import type { IMasterServiceRepository } from 'src/modules/masters/domain/repositories/master-service/i-master-service.repository';
import type { IMasterWeeklyScheduleRepository } from 'src/modules/masters/domain/repositories/master-weekly-schedule/i-master-weekly-schedule.repository';
import type { CreateNotificationUseCase } from 'src/modules/notifications/application/use-cases/notification/create-notification.use-case';
import {
  NotificationCategory,
  NotificationRelatedEntityType,
  NotificationType,
} from 'src/modules/notifications/domain/entities/notification';
import type { NotificationMessageCatalog } from 'src/modules/notifications/infrastructure/i18n/notification-message-catalog';
import { EUserLanguage } from 'src/modules/users/domain/entities/user';
import { ensureUsersNotBlocked } from 'src/modules/users/domain/entities/user-block';
import type { IUserBlockRepository } from 'src/modules/users/domain/repositories/user-block/i-user-block.repository';
import type { IUserRepository } from 'src/modules/users/domain/repositories/user/i-user.repository';
import type { ICreateAppointmentApplicationInput } from '../../dtos/appointment/create-appointment.input';
import type { ICreateAppointmentApplicationOutput } from '../../dtos/appointment/create-appointment.output';
import { IAppointmentRealtimePublisher } from '../../ports/appointment/i-appointment-realtime.publisher';
import type { IAppointmentChatRealtimePublisher } from '../../ports/i-appointment-chat-realtime.publisher';

export class CreateAppointmentUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly appointmentChatRepository: IAppointmentChatRepository,
    private readonly appointmentChatMessageRepository: IAppointmentChatMessageRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
    private readonly masterServiceRepository: IMasterServiceRepository,
    private readonly masterWeeklyScheduleRepository: IMasterWeeklyScheduleRepository,
    private readonly masterScheduleExceptionRepository: IMasterScheduleExceptionRepository,
    private readonly userBlockRepository: IUserBlockRepository,
    private readonly userRepository: IUserRepository,
    private readonly realtimeAppointmentPublisher: IAppointmentRealtimePublisher,
    private readonly realtimeChatPublisher: IAppointmentChatRealtimePublisher,
    private readonly createNotificationUseCase: CreateNotificationUseCase,
    private readonly sendWebPushToUserUseCase: SendWebPushToUserUseCase,
    private readonly notificationMessageCatalog: NotificationMessageCatalog,
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

    const owner = await this.userRepository.findEntityById(profile.userId);
    ensureMasterOwnerEmailVerified(profile.id, owner?.emailVerifiedAt);

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

    ensureMasterServiceBookable(service);

    const result = await this.transactionManager.runInTransaction(
      async (scope) => {
        const now = new Date();
        const timezone = profile.timezone || 'Europe/Moscow';
        const date = formatInTimeZone(input.startsAt, timezone, 'yyyy-MM-dd');
        const { dayStart, dayEnd } = getLocalDayBoundsUtc(date, timezone);
        const clientAppointmentsFrom = addDays(dayStart, -1);

        const [
          weeklySchedules,
          exceptions,
          dayAppointments,
          clientAppointments,
        ] = await Promise.all([
          this.masterWeeklyScheduleRepository.findMany(
            {
              where: {
                and: [
                  { masterProfileId: { eq: profile.id } },
                  { deletedAt: { isNull: true } },
                ],
              },
            },
            scope,
          ),
          this.masterScheduleExceptionRepository.findMany(
            {
              where: {
                and: [
                  { masterProfileId: { eq: profile.id } },
                  { startsAt: { lt: dayEnd } },
                  { endsAt: { gt: dayStart } },
                  { deletedAt: { isNull: true } },
                ],
              },
            },
            scope,
          ),
          this.appointmentRepository.findMany(
            {
              where: {
                and: [
                  { masterProfileId: { eq: profile.id } },
                  { startsAt: { gte: dayStart, lt: dayEnd } },
                  { status: { notIn: [EAppointmentStatus.CANCELLED] } },
                  { deletedAt: { isNull: true } },
                ],
              },
            },
            scope,
          ),
          this.appointmentRepository.findMany(
            {
              where: {
                and: [
                  { clientUserId: { eq: clientUserId } },
                  {
                    startsAt: {
                      gte: clientAppointmentsFrom,
                      lt: dayEnd,
                    },
                  },
                  {
                    status: {
                      in: [
                        EAppointmentStatus.PENDING,
                        EAppointmentStatus.CONFIRMED,
                      ],
                    },
                  },
                  { deletedAt: { isNull: true } },
                ],
              },
            },
            scope,
          ),
        ]);

        const slotAvailable = isMasterStartsAtAvailable({
          profile,
          service,
          date,
          weeklySchedules:
            weeklySchedules as IMasterWeeklySchedulePublicEntity[],
          exceptions: exceptions as IMasterScheduleExceptionPublicEntity[],
          appointments: dayAppointments as IAppointmentPublicEntity[],
          clientAppointments: clientAppointments as IAppointmentPublicEntity[],
          startsAt: input.startsAt,
          now,
        });

        if (!slotAvailable) {
          throw new AppointmentNotAvailableError(input.startsAt);
        }

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
          body: null,
          systemAction: EAppointmentChatSystemAction.APPOINTMENT_CREATED,
          payload: { serviceName: service.name },
        };
        const systemMessage =
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
            systemAction: null,
            payload: null,
          };
          await this.appointmentChatMessageRepository.create(
            messageInput,
            scope,
          );
        }

        await this.realtimeAppointmentPublisher.appointmentCreated(created, {
          recipientUserId: profile.userId,
        });

        return { appointment: created, systemMessage };
      },
    );

    await Promise.all([
      this.realtimeChatPublisher.messageCreated(result.systemMessage, {
        recipientUserId: profile.userId,
      }),
      this.realtimeChatPublisher.messageCreated(result.systemMessage, {
        recipientUserId: clientUserId,
      }),
    ]);

    const recipient = await this.userRepository.findEntityById(profile.userId);
    const { title, body } = this.notificationMessageCatalog.resolve(
      recipient?.language ?? EUserLanguage.RU,
      {
        type: NotificationType.APPOINTMENT_CREATED,
        date: new Date(),
      },
    );
    const actionUrl = '/appointments';
    const payload = {
      type: 'appointment_created',
      appointmentId: result.appointment.id,
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
        relatedEntityId: result.appointment.id,
        payload,
        idempotencyKey: `appointment_created:${result.appointment.id}`,
      })
      .catch(() => undefined);

    void this.sendWebPushToUserUseCase.execute({
      userId: profile.userId,
      title,
      body,
      data: payload,
    });

    return result.appointment;
  }
}

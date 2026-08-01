import { SendWebPushToUserUseCase } from '@modules/web-push-subscriptions/application/use-cases/web-push-subscription/send-web-push-to-user.use-case';
import type { ITransactionManager } from '@shared/domain/transactions';
import { addDays } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import {
  AppointmentNotAvailableError,
  EAppointmentStatus,
  ensureActorCanRescheduleAppointment,
  ensureAppointmentAccessible,
  ensureAppointmentExists,
  ensureAppointmentReschedulable,
  type IAppointmentPublicEntity,
  type IUpdateAppointmentInput,
} from 'src/modules/appointments/domain/entities/appointment';
import type {
  IAppointmentChatMessageEntity,
  ICreateAppointmentChatMessageInput,
} from 'src/modules/appointments/domain/entities/appointment-chat-message';
import {
  EAppointmentChatMessageActor,
  EAppointmentChatSystemAction,
} from 'src/modules/appointments/domain/entities/appointment-chat-message';
import type { IAppointmentChatMessageRepository } from 'src/modules/appointments/domain/repositories/appointment-chat-message/i-appointment-chat-message.repository';
import type { IAppointmentRepository } from 'src/modules/appointments/domain/repositories/appointment/i-appointment.repository';
import {
  getLocalDayBoundsUtc,
  isMasterStartsAtAvailable,
} from 'src/modules/masters/application/services/calculate-master-available-slots';
import { ensureMasterProfileExists } from 'src/modules/masters/domain/entities/master-profile';
import type { IMasterScheduleExceptionPublicEntity } from 'src/modules/masters/domain/entities/master-schedule-exception';
import { MasterServiceNotFoundError } from 'src/modules/masters/domain/entities/master-service';
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
import type { IUserRepository } from 'src/modules/users/domain/repositories/user/i-user.repository';
import type { IRescheduleAppointmentApplicationInput } from '../../dtos/appointment/reschedule-appointment.input';
import type { IRescheduleAppointmentApplicationOutput } from '../../dtos/appointment/reschedule-appointment.output';
import type { IAppointmentRealtimePublisher } from '../../ports/appointment/i-appointment-realtime.publisher';
import type { IAppointmentChatRealtimePublisher } from '../../ports/i-appointment-chat-realtime.publisher';
import type { CancelAppointmentRemindersUseCase } from './cancel-appointment-reminders.use-case';
import type { ScheduleAppointmentRemindersUseCase } from './schedule-appointment-reminders.use-case';

export class RescheduleAppointmentUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly appointmentChatMessageRepository: IAppointmentChatMessageRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
    private readonly masterServiceRepository: IMasterServiceRepository,
    private readonly masterWeeklyScheduleRepository: IMasterWeeklyScheduleRepository,
    private readonly masterScheduleExceptionRepository: IMasterScheduleExceptionRepository,
    private readonly userRepository: IUserRepository,
    private readonly realtimeAppointmentPublisher: IAppointmentRealtimePublisher,
    private readonly realtimeChatPublisher: IAppointmentChatRealtimePublisher,
    private readonly createNotificationUseCase: CreateNotificationUseCase,
    private readonly sendWebPushToUserUseCase: SendWebPushToUserUseCase,
    private readonly notificationMessageCatalog: NotificationMessageCatalog,
    private readonly cancelAppointmentRemindersUseCase: CancelAppointmentRemindersUseCase,
    private readonly scheduleAppointmentRemindersUseCase: ScheduleAppointmentRemindersUseCase,
  ) {}

  async execute(
    input: IRescheduleAppointmentApplicationInput,
  ): Promise<IRescheduleAppointmentApplicationOutput> {
    const existing = await this.appointmentRepository.findEntityById(input.id);
    ensureAppointmentExists(existing, input.id);

    const profile = await this.masterProfileRepository.findEntityById(
      existing.masterProfileId,
    );
    ensureMasterProfileExists(profile, existing.masterProfileId);
    ensureAppointmentAccessible(existing, input.actor, profile.userId);
    ensureAppointmentReschedulable(existing);
    ensureActorCanRescheduleAppointment(existing, input.actor, profile.userId);

    if (existing.startsAt.toISOString() === input.startsAt.toISOString()) {
      return existing;
    }

    const service = await this.masterServiceRepository.findEntityById(
      existing.masterServiceId,
    );
    if (!service || service.masterProfileId !== existing.masterProfileId) {
      throw new MasterServiceNotFoundError(existing.masterServiceId);
    }

    const previousStartsAt = existing.startsAt;

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
                  { clientUserId: { eq: existing.clientUserId } },
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
          excludeAppointmentId: existing.id,
          startsAt: input.startsAt,
          now,
        });

        if (!slotAvailable) {
          throw new AppointmentNotAvailableError(input.startsAt);
        }

        const patch: IUpdateAppointmentInput = {
          startsAt: input.startsAt,
        };

        const appointment = await this.appointmentRepository.update(
          input.id,
          patch,
          scope,
        );

        let systemMessage: IAppointmentChatMessageEntity | null = null;
        if (appointment.chatId) {
          const systemMessageInput: ICreateAppointmentChatMessageInput = {
            chatId: appointment.chatId,
            senderUserId: null,
            actor: EAppointmentChatMessageActor.SYSTEM,
            body: null,
            systemAction: EAppointmentChatSystemAction.APPOINTMENT_RESCHEDULED,
            payload: {
              serviceName: appointment.serviceName,
              previousStartsAt: previousStartsAt.toISOString(),
              startsAt: appointment.startsAt.toISOString(),
            },
          };
          systemMessage = await this.appointmentChatMessageRepository.create(
            systemMessageInput,
            scope,
          );
        }

        await this.cancelAppointmentRemindersUseCase.execute({
          appointmentId: appointment.id,
          scope,
        });

        if (appointment.status === EAppointmentStatus.CONFIRMED) {
          await this.scheduleAppointmentRemindersUseCase.execute({
            appointmentId: appointment.id,
            startsAt: appointment.startsAt,
            scope,
          });
        }

        return { appointment, systemMessage };
      },
    );

    const updated = result.appointment;

    if (result.systemMessage) {
      await Promise.all([
        this.realtimeChatPublisher.messageCreated(result.systemMessage, {
          recipientUserId: updated.clientUserId,
        }),
        this.realtimeChatPublisher.messageCreated(result.systemMessage, {
          recipientUserId: profile.userId,
        }),
      ]);
    }

    const isClient = updated.clientUserId === input.actor.userId;
    const isMaster = profile.userId === input.actor.userId;
    const notifyUserIds =
      isClient && !isMaster
        ? [profile.userId]
        : isMaster && !isClient
          ? [updated.clientUserId]
          : [updated.clientUserId, profile.userId].filter(
              (id) => id !== input.actor.userId,
            );

    const actionUrl = `/record/${updated.id}`;
    const payload = {
      type: 'appointment_rescheduled',
      appointmentId: updated.id,
      url: actionUrl,
    };

    for (const userId of notifyUserIds) {
      const recipient = await this.userRepository.findEntityById(userId);
      const { title, body } = this.notificationMessageCatalog.resolve(
        recipient?.language ?? EUserLanguage.RU,
        {
          type: NotificationType.APPOINTMENT_RESCHEDULED,
          serviceName: updated.serviceName,
        },
      );

      void this.createNotificationUseCase
        .execute({
          userId,
          actorUserId: input.actor.userId,
          category: NotificationCategory.APPOINTMENT,
          type: NotificationType.APPOINTMENT_RESCHEDULED,
          title,
          body,
          actionUrl,
          relatedEntityType: NotificationRelatedEntityType.APPOINTMENT,
          relatedEntityId: updated.id,
          payload,
          idempotencyKey: `appointment_rescheduled:${updated.id}:${updated.startsAt.toISOString()}:${userId}`,
        })
        .catch(() => undefined);

      void this.sendWebPushToUserUseCase.execute({
        userId,
        title,
        body,
        data: payload,
      });
    }

    await Promise.all([
      this.realtimeAppointmentPublisher.appointmentUpdated(updated, {
        recipientUserId: updated.clientUserId,
      }),
      this.realtimeAppointmentPublisher.appointmentUpdated(updated, {
        recipientUserId: profile.userId,
      }),
    ]);

    return updated;
  }
}

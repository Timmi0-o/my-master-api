import { APPOINTMENT_REALTIME_PUBLISHER_TOKEN } from '@modules/appointments/application/ports/appointment/appointment-realtime.publisher.tokens';
import { IAppointmentRealtimePublisher } from '@modules/appointments/application/ports/appointment/i-appointment-realtime.publisher';
import { AppointmentGateway } from '@modules/appointments/presentation/web-socket/appointment/appointment.gateway';
import { WsJwtAuthGuard } from '@modules/appointments/presentation/web-socket/appointment/guards/ws-jwt-auth.guard';
import { CreateNotificationUseCase } from '@modules/notifications/application/use-cases/notification/create-notification.use-case';
import { NotificationsModule } from '@modules/notifications/notifications.module';
import { SendWebPushToUserUseCase } from '@modules/web-push-subscriptions/application/use-cases/web-push-subscription/send-web-push-to-user.use-case';
import { WebPushSubscriptionsModule } from '@modules/web-push-subscriptions/web-push-subscriptions.module';
import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import type { ITransactionManager } from '@shared/domain/transactions';
import { TRANSACTION_MANAGER_TOKEN } from '@shared/domain/transactions';
import type { IMasterProfileRepository } from '../../../../masters/domain/repositories/master-profile/i-master-profile.repository';
import { MASTER_PROFILE_REPOSITORY_TOKEN } from '../../../../masters/domain/repositories/master-profile/master-profile.repository.tokens';
import type { IMasterScheduleExceptionRepository } from '../../../../masters/domain/repositories/master-schedule-exception/i-master-schedule-exception.repository';
import { MASTER_SCHEDULE_EXCEPTION_REPOSITORY_TOKEN } from '../../../../masters/domain/repositories/master-schedule-exception/master-schedule-exception.repository.tokens';
import type { IMasterServiceRepository } from '../../../../masters/domain/repositories/master-service/i-master-service.repository';
import { MASTER_SERVICE_REPOSITORY_TOKEN } from '../../../../masters/domain/repositories/master-service/master-service.repository.tokens';
import type { IMasterWeeklyScheduleRepository } from '../../../../masters/domain/repositories/master-weekly-schedule/i-master-weekly-schedule.repository';
import { MASTER_WEEKLY_SCHEDULE_REPOSITORY_TOKEN } from '../../../../masters/domain/repositories/master-weekly-schedule/master-weekly-schedule.repository.tokens';
import { ImageModule } from '../../../../masters/infrastructure/modules/image/image.module';
import { MastersModule } from '../../../../masters/masters.module';
import type { IUserBlockRepository } from '../../../../users/domain/repositories/user-block/i-user-block.repository';
import { USER_BLOCK_REPOSITORY_TOKEN } from '../../../../users/domain/repositories/user-block/user-block.repository.tokens';
import type { IUserPersonalNoteRepository } from '../../../../users/domain/repositories/user-personal-note/i-user-personal-note.repository';
import { USER_PERSONAL_NOTE_REPOSITORY_TOKEN } from '../../../../users/domain/repositories/user-personal-note/user-personal-note.repository.tokens';
import type { IUserRepository } from '../../../../users/domain/repositories/user/i-user.repository';
import { USER_REPOSITORY_TOKEN } from '../../../../users/domain/repositories/user/user.repository.tokens';
import { UsersModule } from '../../../../users/users.module';
import { CancelAppointmentRemindersUseCase } from '../../../application/use-cases/appointment/cancel-appointment-reminders.use-case';
import { CancelAppointmentUseCase } from '../../../application/use-cases/appointment/cancel-appointment.use-case';
import { CompleteAppointmentUseCase } from '../../../application/use-cases/appointment/complete-appointment.use-case';
import { ConfirmAppointmentUseCase } from '../../../application/use-cases/appointment/confirm-appointment.use-case';
import { CreateAppointmentUseCase } from '../../../application/use-cases/appointment/create-appointment.use-case';
import { DeleteAppointmentByIdUseCase } from '../../../application/use-cases/appointment/delete-appointment-by-id.use-case';
import { GetAppointmentByIdUseCase } from '../../../application/use-cases/appointment/get-appointment-by-id.use-case';
import { GetAppointmentsUseCase } from '../../../application/use-cases/appointment/get-appointments.use-case';
import { GetMyAppointmentsUseCase } from '../../../application/use-cases/appointment/get-my-appointments.use-case';
import { GetMyClientsAppointmentsUseCase } from '../../../application/use-cases/appointment/get-my-clients-appointments.use-case';
import { ProcessDueAppointmentRemindersUseCase } from '../../../application/use-cases/appointment/process-due-appointment-reminders.use-case';
import { ScheduleAppointmentRemindersUseCase } from '../../../application/use-cases/appointment/schedule-appointment-reminders.use-case';
import { UpdateAppointmentByIdUseCase } from '../../../application/use-cases/appointment/update-appointment-by-id.use-case';
import { APPOINTMENT_CHAT_MESSAGE_REPOSITORY_TOKEN } from '../../../domain/repositories/appointment-chat-message/appointment-chat-message.repository.tokens';
import type { IAppointmentChatMessageRepository } from '../../../domain/repositories/appointment-chat-message/i-appointment-chat-message.repository';
import { APPOINTMENT_CHAT_REPOSITORY_TOKEN } from '../../../domain/repositories/appointment-chat/appointment-chat.repository.tokens';
import type { IAppointmentChatRepository } from '../../../domain/repositories/appointment-chat/i-appointment-chat.repository';
import { APPOINTMENT_REMINDER_JOB_REPOSITORY_TOKEN } from '../../../domain/repositories/appointment-reminder-job/appointment-reminder-job.repository.tokens';
import type { IAppointmentReminderJobRepository } from '../../../domain/repositories/appointment-reminder-job/i-appointment-reminder-job.repository';
import { APPOINTMENT_REPOSITORY_TOKEN } from '../../../domain/repositories/appointment/appointment.repository.tokens';
import type { IAppointmentRepository } from '../../../domain/repositories/appointment/i-appointment.repository';
import { PrismaAppointmentReminderJobRepository } from '../../persistence/repositories/appointment-reminder-job/prisma-appointment-reminder-job.repository';
import { PrismaAppointmentRepository } from '../../persistence/repositories/appointment/prisma-appointment.repository';
import { AppointmentRemindersScheduler } from '../../schedulers/appointment-reminders.scheduler';
import { AppointmentRealtimeEventBus } from '../../web-socket/appointment/appointment-realtime.event-bus';
import { SocketIoAppointmentRealtimePublisher } from '../../web-socket/appointment/socket-io-appointment-realtime.publisher';
import { AppointmentChatMessageModule } from '../appointment-chat-message/appointment-chat-message.module';
import { AppointmentChatModule } from '../appointment-chat/appointment-chat.module';

@Module({
  imports: [
    forwardRef(() => MastersModule),
    UsersModule,
    forwardRef(() => ImageModule),
    forwardRef(() => AppointmentChatModule),
    forwardRef(() => AppointmentChatMessageModule),
    NotificationsModule,
    WebPushSubscriptionsModule,
    JwtModule.register({}),
  ],
  providers: [
    AppointmentGateway,
    WsJwtAuthGuard,
    AppointmentRealtimeEventBus,
    {
      provide: APPOINTMENT_REALTIME_PUBLISHER_TOKEN,
      useClass: SocketIoAppointmentRealtimePublisher,
    },
    {
      provide: APPOINTMENT_REPOSITORY_TOKEN,
      useClass: PrismaAppointmentRepository,
    },
    {
      provide: APPOINTMENT_REMINDER_JOB_REPOSITORY_TOKEN,
      useClass: PrismaAppointmentReminderJobRepository,
    },
    {
      provide: ScheduleAppointmentRemindersUseCase,
      useFactory: (repo: IAppointmentReminderJobRepository) =>
        new ScheduleAppointmentRemindersUseCase(repo),
      inject: [APPOINTMENT_REMINDER_JOB_REPOSITORY_TOKEN],
    },
    {
      provide: CancelAppointmentRemindersUseCase,
      useFactory: (repo: IAppointmentReminderJobRepository) =>
        new CancelAppointmentRemindersUseCase(repo),
      inject: [APPOINTMENT_REMINDER_JOB_REPOSITORY_TOKEN],
    },
    {
      provide: ProcessDueAppointmentRemindersUseCase,
      useFactory: (
        reminderJobRepo: IAppointmentReminderJobRepository,
        appointmentRepo: IAppointmentRepository,
        profileRepo: IMasterProfileRepository,
        createNotificationUseCase: CreateNotificationUseCase,
        sendWebPushToUserUseCase: SendWebPushToUserUseCase,
      ) =>
        new ProcessDueAppointmentRemindersUseCase(
          reminderJobRepo,
          appointmentRepo,
          profileRepo,
          createNotificationUseCase,
          sendWebPushToUserUseCase,
        ),
      inject: [
        APPOINTMENT_REMINDER_JOB_REPOSITORY_TOKEN,
        APPOINTMENT_REPOSITORY_TOKEN,
        MASTER_PROFILE_REPOSITORY_TOKEN,
        CreateNotificationUseCase,
        SendWebPushToUserUseCase,
      ],
    },
    AppointmentRemindersScheduler,
    {
      provide: GetAppointmentsUseCase,
      useFactory: (repo: IAppointmentRepository) =>
        new GetAppointmentsUseCase(repo),
      inject: [APPOINTMENT_REPOSITORY_TOKEN],
    },
    {
      provide: GetMyAppointmentsUseCase,
      useFactory: (
        repo: IAppointmentRepository,
        personalNoteRepo: IUserPersonalNoteRepository,
      ) => new GetMyAppointmentsUseCase(repo, personalNoteRepo),
      inject: [
        APPOINTMENT_REPOSITORY_TOKEN,
        USER_PERSONAL_NOTE_REPOSITORY_TOKEN,
      ],
    },
    {
      provide: GetMyClientsAppointmentsUseCase,
      useFactory: (
        repo: IAppointmentRepository,
        personalNoteRepo: IUserPersonalNoteRepository,
      ) => new GetMyClientsAppointmentsUseCase(repo, personalNoteRepo),
      inject: [
        APPOINTMENT_REPOSITORY_TOKEN,
        USER_PERSONAL_NOTE_REPOSITORY_TOKEN,
      ],
    },
    {
      provide: GetAppointmentByIdUseCase,
      useFactory: (
        appointmentRepo: IAppointmentRepository,
        profileRepo: IMasterProfileRepository,
        personalNoteRepo: IUserPersonalNoteRepository,
      ) =>
        new GetAppointmentByIdUseCase(
          appointmentRepo,
          profileRepo,
          personalNoteRepo,
        ),
      inject: [
        APPOINTMENT_REPOSITORY_TOKEN,
        MASTER_PROFILE_REPOSITORY_TOKEN,
        USER_PERSONAL_NOTE_REPOSITORY_TOKEN,
      ],
    },
    {
      provide: CreateAppointmentUseCase,
      useFactory: (
        transactionManager: ITransactionManager,
        appointmentRepo: IAppointmentRepository,
        chatRepo: IAppointmentChatRepository,
        messageRepo: IAppointmentChatMessageRepository,
        profileRepo: IMasterProfileRepository,
        serviceRepo: IMasterServiceRepository,
        weeklyScheduleRepo: IMasterWeeklyScheduleRepository,
        scheduleExceptionRepo: IMasterScheduleExceptionRepository,
        userBlockRepo: IUserBlockRepository,
        userRepo: IUserRepository,
        realtimeAppointmentPublisher: IAppointmentRealtimePublisher,
        createNotificationUseCase: CreateNotificationUseCase,
        sendWebPushToUserUseCase: SendWebPushToUserUseCase,
      ) =>
        new CreateAppointmentUseCase(
          transactionManager,
          appointmentRepo,
          chatRepo,
          messageRepo,
          profileRepo,
          serviceRepo,
          weeklyScheduleRepo,
          scheduleExceptionRepo,
          userBlockRepo,
          userRepo,
          realtimeAppointmentPublisher,
          createNotificationUseCase,
          sendWebPushToUserUseCase,
        ),
      inject: [
        TRANSACTION_MANAGER_TOKEN,
        APPOINTMENT_REPOSITORY_TOKEN,
        APPOINTMENT_CHAT_REPOSITORY_TOKEN,
        APPOINTMENT_CHAT_MESSAGE_REPOSITORY_TOKEN,
        MASTER_PROFILE_REPOSITORY_TOKEN,
        MASTER_SERVICE_REPOSITORY_TOKEN,
        MASTER_WEEKLY_SCHEDULE_REPOSITORY_TOKEN,
        MASTER_SCHEDULE_EXCEPTION_REPOSITORY_TOKEN,
        USER_BLOCK_REPOSITORY_TOKEN,
        USER_REPOSITORY_TOKEN,
        APPOINTMENT_REALTIME_PUBLISHER_TOKEN,
        CreateNotificationUseCase,
        SendWebPushToUserUseCase,
      ],
    },
    {
      provide: ConfirmAppointmentUseCase,
      useFactory: (
        transactionManager: ITransactionManager,
        appointmentRepo: IAppointmentRepository,
        messageRepo: IAppointmentChatMessageRepository,
        profileRepo: IMasterProfileRepository,
        realtimeAppointmentPublisher: IAppointmentRealtimePublisher,
        createNotificationUseCase: CreateNotificationUseCase,
        sendWebPushToUserUseCase: SendWebPushToUserUseCase,
        scheduleAppointmentRemindersUseCase: ScheduleAppointmentRemindersUseCase,
      ) =>
        new ConfirmAppointmentUseCase(
          transactionManager,
          appointmentRepo,
          messageRepo,
          profileRepo,
          realtimeAppointmentPublisher,
          createNotificationUseCase,
          sendWebPushToUserUseCase,
          scheduleAppointmentRemindersUseCase,
        ),
      inject: [
        TRANSACTION_MANAGER_TOKEN,
        APPOINTMENT_REPOSITORY_TOKEN,
        APPOINTMENT_CHAT_MESSAGE_REPOSITORY_TOKEN,
        MASTER_PROFILE_REPOSITORY_TOKEN,
        APPOINTMENT_REALTIME_PUBLISHER_TOKEN,
        CreateNotificationUseCase,
        SendWebPushToUserUseCase,
        ScheduleAppointmentRemindersUseCase,
      ],
    },
    {
      provide: CancelAppointmentUseCase,
      useFactory: (
        transactionManager: ITransactionManager,
        appointmentRepo: IAppointmentRepository,
        messageRepo: IAppointmentChatMessageRepository,
        profileRepo: IMasterProfileRepository,
        realtimeAppointmentPublisher: IAppointmentRealtimePublisher,
        createNotificationUseCase: CreateNotificationUseCase,
        sendWebPushToUserUseCase: SendWebPushToUserUseCase,
        cancelAppointmentRemindersUseCase: CancelAppointmentRemindersUseCase,
      ) =>
        new CancelAppointmentUseCase(
          transactionManager,
          appointmentRepo,
          messageRepo,
          profileRepo,
          realtimeAppointmentPublisher,
          createNotificationUseCase,
          sendWebPushToUserUseCase,
          cancelAppointmentRemindersUseCase,
        ),
      inject: [
        TRANSACTION_MANAGER_TOKEN,
        APPOINTMENT_REPOSITORY_TOKEN,
        APPOINTMENT_CHAT_MESSAGE_REPOSITORY_TOKEN,
        MASTER_PROFILE_REPOSITORY_TOKEN,
        APPOINTMENT_REALTIME_PUBLISHER_TOKEN,
        CreateNotificationUseCase,
        SendWebPushToUserUseCase,
        CancelAppointmentRemindersUseCase,
      ],
    },
    {
      provide: CompleteAppointmentUseCase,
      useFactory: (
        transactionManager: ITransactionManager,
        appointmentRepo: IAppointmentRepository,
        profileRepo: IMasterProfileRepository,
      ) =>
        new CompleteAppointmentUseCase(
          transactionManager,
          appointmentRepo,
          profileRepo,
        ),
      inject: [
        TRANSACTION_MANAGER_TOKEN,
        APPOINTMENT_REPOSITORY_TOKEN,
        MASTER_PROFILE_REPOSITORY_TOKEN,
      ],
    },
    {
      provide: UpdateAppointmentByIdUseCase,
      useFactory: (
        transactionManager: ITransactionManager,
        appointmentRepo: IAppointmentRepository,
        profileRepo: IMasterProfileRepository,
      ) =>
        new UpdateAppointmentByIdUseCase(
          transactionManager,
          appointmentRepo,
          profileRepo,
        ),
      inject: [
        TRANSACTION_MANAGER_TOKEN,
        APPOINTMENT_REPOSITORY_TOKEN,
        MASTER_PROFILE_REPOSITORY_TOKEN,
      ],
    },
    {
      provide: DeleteAppointmentByIdUseCase,
      useFactory: (
        transactionManager: ITransactionManager,
        appointmentRepo: IAppointmentRepository,
        profileRepo: IMasterProfileRepository,
      ) =>
        new DeleteAppointmentByIdUseCase(
          transactionManager,
          appointmentRepo,
          profileRepo,
        ),
      inject: [
        TRANSACTION_MANAGER_TOKEN,
        APPOINTMENT_REPOSITORY_TOKEN,
        MASTER_PROFILE_REPOSITORY_TOKEN,
      ],
    },
  ],
  exports: [
    APPOINTMENT_REPOSITORY_TOKEN,
    APPOINTMENT_REALTIME_PUBLISHER_TOKEN,
    GetAppointmentsUseCase,
    GetMyAppointmentsUseCase,
    GetMyClientsAppointmentsUseCase,
    GetAppointmentByIdUseCase,
    CreateAppointmentUseCase,
    ConfirmAppointmentUseCase,
    CancelAppointmentUseCase,
    CompleteAppointmentUseCase,
    UpdateAppointmentByIdUseCase,
    DeleteAppointmentByIdUseCase,
    AppointmentGateway,
    WsJwtAuthGuard,
  ],
})
export class AppointmentModule {}

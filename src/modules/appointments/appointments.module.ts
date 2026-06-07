import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../auth/presentation/guards/jwt-auth.guard';
import type { IMasterProfileRepository } from '../masters/domain/repositories/master-profile/i-master-profile.repository';
import { MASTER_PROFILE_REPOSITORY_TOKEN } from '../masters/domain/repositories/master-profile/master-profile.repository.tokens';
import type { IMasterServiceRepository } from '../masters/domain/repositories/master-service/i-master-service.repository';
import { MASTER_SERVICE_REPOSITORY_TOKEN } from '../masters/domain/repositories/master-service/master-service.repository.tokens';
import { MastersModule } from '../masters/masters.module';
import { UsersModule } from '../users/users.module';
import { APPOINTMENT_CHAT_REALTIME_PUBLISHER_TOKEN } from './application/ports/appointment-chat-realtime.publisher.tokens';
import type { IAppointmentChatRealtimePublisher } from './application/ports/i-appointment-chat-realtime.publisher';
import { CreateAppointmentChatMessageUseCase } from './application/use-cases/appointment-chat-message/create-appointment-chat-message.use-case';
import { DeleteAppointmentChatMessageByIdUseCase } from './application/use-cases/appointment-chat-message/delete-appointment-chat-message-by-id.use-case';
import { GetAppointmentChatMessageByIdUseCase } from './application/use-cases/appointment-chat-message/get-appointment-chat-message-by-id.use-case';
import { GetAppointmentChatMessagesUseCase } from './application/use-cases/appointment-chat-message/get-appointment-chat-messages.use-case';
import { AssertAppointmentChatAccessUseCase } from './application/use-cases/appointment-chat/assert-appointment-chat-access.use-case';
import { DeleteAppointmentChatByIdUseCase } from './application/use-cases/appointment-chat/delete-appointment-chat-by-id.use-case';
import { GetAppointmentChatByIdUseCase } from './application/use-cases/appointment-chat/get-appointment-chat-by-id.use-case';
import { GetAppointmentChatsUseCase } from './application/use-cases/appointment-chat/get-appointment-chats.use-case';
import { CreateAppointmentUseCase } from './application/use-cases/appointment/create-appointment.use-case';
import { DeleteAppointmentByIdUseCase } from './application/use-cases/appointment/delete-appointment-by-id.use-case';
import { GetAppointmentByIdUseCase } from './application/use-cases/appointment/get-appointment-by-id.use-case';
import { GetAppointmentsUseCase } from './application/use-cases/appointment/get-appointments.use-case';
import { GetMyAppointmentsUseCase } from './application/use-cases/appointment/get-my-appointments.use-case';
import { GetMyClientsAppointmentsUseCase } from './application/use-cases/appointment/get-my-clients-appointments.use-case';
import { UpdateAppointmentByIdUseCase } from './application/use-cases/appointment/update-appointment-by-id.use-case';
import { APPOINTMENT_CHAT_MESSAGE_REPOSITORY_TOKEN } from './domain/repositories/appointment-chat-message/appointment-chat-message.repository.tokens';
import type { IAppointmentChatMessageRepository } from './domain/repositories/appointment-chat-message/i-appointment-chat-message.repository';
import { APPOINTMENT_CHAT_REPOSITORY_TOKEN } from './domain/repositories/appointment-chat/appointment-chat.repository.tokens';
import type { IAppointmentChatRepository } from './domain/repositories/appointment-chat/i-appointment-chat.repository';
import { APPOINTMENT_REPOSITORY_TOKEN } from './domain/repositories/appointment/appointment.repository.tokens';
import type { IAppointmentRepository } from './domain/repositories/appointment/i-appointment.repository';
import { PrismaAppointmentChatMessageRepository } from './infrastructure/persistence/repositories/appointment-chat-message/prisma-appointment-chat-message.repository';
import { PrismaAppointmentChatRepository } from './infrastructure/persistence/repositories/appointment-chat/prisma-appointment-chat.repository';
import { PrismaAppointmentRepository } from './infrastructure/persistence/repositories/appointment/prisma-appointment.repository';
import { AppointmentChatRealtimeEventBus } from './infrastructure/web-socket/appointment-chat-realtime.event-bus';
import { SocketIoAppointmentChatRealtimePublisher } from './infrastructure/web-socket/socket-io-appointment-chat-realtime.publisher';
import { AppointmentChatMessagesController } from './presentation/http/controllers/appointment-chat-messages.controller';
import { AppointmentChatsController } from './presentation/http/controllers/appointment-chats.controller';
import { AppointmentsController } from './presentation/http/controllers/appointments.controller';
import { AppointmentChatMessageValidator } from './presentation/http/validation/appointment-chat-message.validator';
import { AppointmentChatValidator } from './presentation/http/validation/appointment-chat.validator';
import { AppointmentValidator } from './presentation/http/validation/appointment.validator';
import { AppointmentChatGateway } from './presentation/web-socket/appointment-chat.gateway';
import { WsJwtAuthGuard } from './presentation/web-socket/guards/ws-jwt-auth.guard';
import { AppointmentChatWsValidator } from './presentation/web-socket/validation/appointment-chat-ws.validator';

@Module({
  imports: [
    forwardRef(() => MastersModule),
    UsersModule,
    JwtModule.register({}),
  ],
  controllers: [
    AppointmentsController,
    AppointmentChatsController,
    AppointmentChatMessagesController,
  ],
  providers: [
    AppointmentValidator,
    AppointmentChatValidator,
    AppointmentChatMessageValidator,
    AppointmentChatWsValidator,
    AppointmentChatGateway,
    WsJwtAuthGuard,
    JwtAuthGuard,
    {
      provide: APPOINTMENT_REPOSITORY_TOKEN,
      useClass: PrismaAppointmentRepository,
    },
    {
      provide: APPOINTMENT_CHAT_REPOSITORY_TOKEN,
      useClass: PrismaAppointmentChatRepository,
    },
    {
      provide: APPOINTMENT_CHAT_MESSAGE_REPOSITORY_TOKEN,
      useClass: PrismaAppointmentChatMessageRepository,
    },
    AppointmentChatRealtimeEventBus,
    {
      provide: APPOINTMENT_CHAT_REALTIME_PUBLISHER_TOKEN,
      useClass: SocketIoAppointmentChatRealtimePublisher,
    },
    {
      provide: GetAppointmentsUseCase,
      useFactory: (repo: IAppointmentRepository) =>
        new GetAppointmentsUseCase(repo),
      inject: [APPOINTMENT_REPOSITORY_TOKEN],
    },
    {
      provide: GetMyAppointmentsUseCase,
      useFactory: (repo: IAppointmentRepository) =>
        new GetMyAppointmentsUseCase(repo),
      inject: [APPOINTMENT_REPOSITORY_TOKEN],
    },
    {
      provide: GetMyClientsAppointmentsUseCase,
      useFactory: (repo: IAppointmentRepository) =>
        new GetMyClientsAppointmentsUseCase(repo),
      inject: [APPOINTMENT_REPOSITORY_TOKEN],
    },
    {
      provide: GetAppointmentByIdUseCase,
      useFactory: (
        appointmentRepo: IAppointmentRepository,
        profileRepo: IMasterProfileRepository,
      ) => new GetAppointmentByIdUseCase(appointmentRepo, profileRepo),
      inject: [APPOINTMENT_REPOSITORY_TOKEN, MASTER_PROFILE_REPOSITORY_TOKEN],
    },
    {
      provide: CreateAppointmentUseCase,
      useFactory: (
        appointmentRepo: IAppointmentRepository,
        profileRepo: IMasterProfileRepository,
        serviceRepo: IMasterServiceRepository,
      ) =>
        new CreateAppointmentUseCase(appointmentRepo, profileRepo, serviceRepo),
      inject: [
        APPOINTMENT_REPOSITORY_TOKEN,
        MASTER_PROFILE_REPOSITORY_TOKEN,
        MASTER_SERVICE_REPOSITORY_TOKEN,
      ],
    },
    {
      provide: UpdateAppointmentByIdUseCase,
      useFactory: (
        appointmentRepo: IAppointmentRepository,
        profileRepo: IMasterProfileRepository,
      ) => new UpdateAppointmentByIdUseCase(appointmentRepo, profileRepo),
      inject: [APPOINTMENT_REPOSITORY_TOKEN, MASTER_PROFILE_REPOSITORY_TOKEN],
    },
    {
      provide: DeleteAppointmentByIdUseCase,
      useFactory: (
        appointmentRepo: IAppointmentRepository,
        profileRepo: IMasterProfileRepository,
      ) => new DeleteAppointmentByIdUseCase(appointmentRepo, profileRepo),
      inject: [APPOINTMENT_REPOSITORY_TOKEN, MASTER_PROFILE_REPOSITORY_TOKEN],
    },
    {
      provide: GetAppointmentChatsUseCase,
      useFactory: (repo: IAppointmentChatRepository) =>
        new GetAppointmentChatsUseCase(repo),
      inject: [APPOINTMENT_CHAT_REPOSITORY_TOKEN],
    },
    {
      provide: GetAppointmentChatByIdUseCase,
      useFactory: (
        chatRepo: IAppointmentChatRepository,
        appointmentRepo: IAppointmentRepository,
        profileRepo: IMasterProfileRepository,
      ) =>
        new GetAppointmentChatByIdUseCase(
          chatRepo,
          appointmentRepo,
          profileRepo,
        ),
      inject: [
        APPOINTMENT_CHAT_REPOSITORY_TOKEN,
        APPOINTMENT_REPOSITORY_TOKEN,
        MASTER_PROFILE_REPOSITORY_TOKEN,
      ],
    },
    {
      provide: AssertAppointmentChatAccessUseCase,
      useFactory: (
        chatRepo: IAppointmentChatRepository,
        appointmentRepo: IAppointmentRepository,
        profileRepo: IMasterProfileRepository,
      ) =>
        new AssertAppointmentChatAccessUseCase(
          chatRepo,
          appointmentRepo,
          profileRepo,
        ),
      inject: [
        APPOINTMENT_CHAT_REPOSITORY_TOKEN,
        APPOINTMENT_REPOSITORY_TOKEN,
        MASTER_PROFILE_REPOSITORY_TOKEN,
      ],
    },
    {
      provide: DeleteAppointmentChatByIdUseCase,
      useFactory: (
        chatRepo: IAppointmentChatRepository,
        appointmentRepo: IAppointmentRepository,
        profileRepo: IMasterProfileRepository,
      ) =>
        new DeleteAppointmentChatByIdUseCase(
          chatRepo,
          appointmentRepo,
          profileRepo,
        ),
      inject: [
        APPOINTMENT_CHAT_REPOSITORY_TOKEN,
        APPOINTMENT_REPOSITORY_TOKEN,
        MASTER_PROFILE_REPOSITORY_TOKEN,
      ],
    },
    {
      provide: GetAppointmentChatMessagesUseCase,
      useFactory: (repo: IAppointmentChatMessageRepository) =>
        new GetAppointmentChatMessagesUseCase(repo),
      inject: [APPOINTMENT_CHAT_MESSAGE_REPOSITORY_TOKEN],
    },
    {
      provide: GetAppointmentChatMessageByIdUseCase,
      useFactory: (
        messageRepo: IAppointmentChatMessageRepository,
        chatRepo: IAppointmentChatRepository,
        appointmentRepo: IAppointmentRepository,
        profileRepo: IMasterProfileRepository,
      ) =>
        new GetAppointmentChatMessageByIdUseCase(
          messageRepo,
          chatRepo,
          appointmentRepo,
          profileRepo,
        ),
      inject: [
        APPOINTMENT_CHAT_MESSAGE_REPOSITORY_TOKEN,
        APPOINTMENT_CHAT_REPOSITORY_TOKEN,
        APPOINTMENT_REPOSITORY_TOKEN,
        MASTER_PROFILE_REPOSITORY_TOKEN,
      ],
    },
    {
      provide: CreateAppointmentChatMessageUseCase,
      useFactory: (
        messageRepo: IAppointmentChatMessageRepository,
        chatRepo: IAppointmentChatRepository,
        appointmentRepo: IAppointmentRepository,
        profileRepo: IMasterProfileRepository,
        realtimePublisher: IAppointmentChatRealtimePublisher,
      ) =>
        new CreateAppointmentChatMessageUseCase(
          messageRepo,
          chatRepo,
          appointmentRepo,
          profileRepo,
          realtimePublisher,
        ),
      inject: [
        APPOINTMENT_CHAT_MESSAGE_REPOSITORY_TOKEN,
        APPOINTMENT_CHAT_REPOSITORY_TOKEN,
        APPOINTMENT_REPOSITORY_TOKEN,
        MASTER_PROFILE_REPOSITORY_TOKEN,
        APPOINTMENT_CHAT_REALTIME_PUBLISHER_TOKEN,
      ],
    },
    {
      provide: DeleteAppointmentChatMessageByIdUseCase,
      useFactory: (
        messageRepo: IAppointmentChatMessageRepository,
        chatRepo: IAppointmentChatRepository,
        appointmentRepo: IAppointmentRepository,
        profileRepo: IMasterProfileRepository,
        realtimePublisher: IAppointmentChatRealtimePublisher,
      ) =>
        new DeleteAppointmentChatMessageByIdUseCase(
          messageRepo,
          chatRepo,
          appointmentRepo,
          profileRepo,
          realtimePublisher,
        ),
      inject: [
        APPOINTMENT_CHAT_MESSAGE_REPOSITORY_TOKEN,
        APPOINTMENT_CHAT_REPOSITORY_TOKEN,
        APPOINTMENT_REPOSITORY_TOKEN,
        MASTER_PROFILE_REPOSITORY_TOKEN,
        APPOINTMENT_CHAT_REALTIME_PUBLISHER_TOKEN,
      ],
    },
  ],
  exports: [
    APPOINTMENT_REPOSITORY_TOKEN,
    APPOINTMENT_CHAT_REPOSITORY_TOKEN,
    APPOINTMENT_CHAT_MESSAGE_REPOSITORY_TOKEN,
  ],
})
export class AppointmentsModule {}

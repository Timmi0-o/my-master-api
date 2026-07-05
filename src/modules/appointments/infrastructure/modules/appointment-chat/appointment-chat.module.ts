import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import type { ITransactionManager } from '@shared/domain/transactions';
import { TRANSACTION_MANAGER_TOKEN } from '@shared/domain/transactions';
import { USER_REPOSITORY_TOKEN } from 'src/modules/users/domain/repositories/user/user.repository.tokens';
import { PrismaUserRepository } from 'src/modules/users/infrastructure/persistence/repositories/user/prisma-user.repository';
import { AuthModule } from '../../../../auth/auth.module';
import type { IMasterProfileRepository } from '../../../../masters/domain/repositories/master-profile/i-master-profile.repository';
import { MASTER_PROFILE_REPOSITORY_TOKEN } from '../../../../masters/domain/repositories/master-profile/master-profile.repository.tokens';
import { MastersModule } from '../../../../masters/masters.module';
import { APPOINTMENT_CHAT_REALTIME_PUBLISHER_TOKEN } from '../../../application/ports/appointment-chat-realtime.publisher.tokens';
import { AssertAppointmentChatAccessUseCase } from '../../../application/use-cases/appointment-chat/assert-appointment-chat-access.use-case';
import { DeleteAppointmentChatByIdUseCase } from '../../../application/use-cases/appointment-chat/delete-appointment-chat-by-id.use-case';
import { GetAppointmentChatByIdUseCase } from '../../../application/use-cases/appointment-chat/get-appointment-chat-by-id.use-case';
import { GetAppointmentChatsUseCase } from '../../../application/use-cases/appointment-chat/get-appointment-chats.use-case';
import { APPOINTMENT_CHAT_REPOSITORY_TOKEN } from '../../../domain/repositories/appointment-chat/appointment-chat.repository.tokens';
import type { IAppointmentChatRepository } from '../../../domain/repositories/appointment-chat/i-appointment-chat.repository';
import { APPOINTMENT_REPOSITORY_TOKEN } from '../../../domain/repositories/appointment/appointment.repository.tokens';
import type { IAppointmentRepository } from '../../../domain/repositories/appointment/i-appointment.repository';
import { AppointmentChatGateway } from '../../../presentation/web-socket/appointment-chat/appointment-chat.gateway';
import { WsJwtAuthGuard } from '../../../presentation/web-socket/appointment-chat/guards/ws-jwt-auth.guard';
import { PrismaAppointmentChatRepository } from '../../persistence/repositories/appointment-chat/prisma-appointment-chat.repository';
import { AppointmentChatRealtimeEventBus } from '../../web-socket/appointment-chat/appointment-chat-realtime.event-bus';
import { SocketIoAppointmentChatRealtimePublisher } from '../../web-socket/appointment-chat/socket-io-appointment-chat-realtime.publisher';
import { AppointmentModule } from '../appointment/appointment.module';

@Module({
  imports: [
    forwardRef(() => MastersModule),
    forwardRef(() => AppointmentModule),
    AuthModule,
    JwtModule.register({}),
  ],
  providers: [
    AppointmentChatGateway,
    WsJwtAuthGuard,
    {
      provide: APPOINTMENT_CHAT_REPOSITORY_TOKEN,
      useClass: PrismaAppointmentChatRepository,
    },
    AppointmentChatRealtimeEventBus,
    {
      provide: APPOINTMENT_CHAT_REALTIME_PUBLISHER_TOKEN,
      useClass: SocketIoAppointmentChatRealtimePublisher,
    },
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: PrismaUserRepository,
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
        transactionManager: ITransactionManager,
        chatRepo: IAppointmentChatRepository,
        appointmentRepo: IAppointmentRepository,
        profileRepo: IMasterProfileRepository,
      ) =>
        new DeleteAppointmentChatByIdUseCase(
          transactionManager,
          chatRepo,
          appointmentRepo,
          profileRepo,
        ),
      inject: [
        TRANSACTION_MANAGER_TOKEN,
        APPOINTMENT_CHAT_REPOSITORY_TOKEN,
        APPOINTMENT_REPOSITORY_TOKEN,
        MASTER_PROFILE_REPOSITORY_TOKEN,
      ],
    },
  ],
  exports: [
    APPOINTMENT_CHAT_REPOSITORY_TOKEN,
    APPOINTMENT_CHAT_REALTIME_PUBLISHER_TOKEN,
    AppointmentChatGateway,
    WsJwtAuthGuard,
    GetAppointmentChatsUseCase,
    GetAppointmentChatByIdUseCase,
    AssertAppointmentChatAccessUseCase,
    DeleteAppointmentChatByIdUseCase,
  ],
})
export class AppointmentChatModule {}

import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import type { ITransactionManager } from '@shared/domain/transactions';
import { TRANSACTION_MANAGER_TOKEN } from '@shared/domain/transactions';
import type { IUserPersonalNoteRepository } from 'src/modules/users/domain/repositories/user-personal-note/i-user-personal-note.repository';
import { USER_PERSONAL_NOTE_REPOSITORY_TOKEN } from 'src/modules/users/domain/repositories/user-personal-note/user-personal-note.repository.tokens';
import { USER_REPOSITORY_TOKEN } from 'src/modules/users/domain/repositories/user/user.repository.tokens';
import { PrismaUserRepository } from 'src/modules/users/infrastructure/persistence/repositories/user/prisma-user.repository';
import { UsersModule } from 'src/modules/users/users.module';
import type { IMasterProfileRepository } from '../../../../masters/domain/repositories/master-profile/i-master-profile.repository';
import { MASTER_PROFILE_REPOSITORY_TOKEN } from '../../../../masters/domain/repositories/master-profile/master-profile.repository.tokens';
import { MastersModule } from '../../../../masters/masters.module';
import { ImageModule } from '../../../../masters/infrastructure/modules/image/image.module';
import { APPOINTMENT_CHAT_REALTIME_PUBLISHER_TOKEN } from '../../../application/ports/appointment-chat-realtime.publisher.tokens';
import type { IAppointmentChatRealtimePublisher } from '../../../application/ports/i-appointment-chat-realtime.publisher';
import { AssertAppointmentChatAccessUseCase } from '../../../application/use-cases/appointment-chat/assert-appointment-chat-access.use-case';
import { DeleteAppointmentChatByIdUseCase } from '../../../application/use-cases/appointment-chat/delete-appointment-chat-by-id.use-case';
import { GetAppointmentChatByIdUseCase } from '../../../application/use-cases/appointment-chat/get-appointment-chat-by-id.use-case';
import { GetAppointmentChatMessageWindowUseCase } from '../../../application/use-cases/appointment-chat/get-appointment-chat-message-window.use-case';
import { GetAppointmentChatsUseCase } from '../../../application/use-cases/appointment-chat/get-appointment-chats.use-case';
import { MarkAppointmentChatReadUseCase } from '../../../application/use-cases/appointment-chat/mark-appointment-chat-read.use-case';
import { APPOINTMENT_CHAT_MESSAGE_REPOSITORY_TOKEN } from '../../../domain/repositories/appointment-chat-message/appointment-chat-message.repository.tokens';
import type { IAppointmentChatMessageRepository } from '../../../domain/repositories/appointment-chat-message/i-appointment-chat-message.repository';
import { APPOINTMENT_CHAT_REPOSITORY_TOKEN } from '../../../domain/repositories/appointment-chat/appointment-chat.repository.tokens';
import type { IAppointmentChatRepository } from '../../../domain/repositories/appointment-chat/i-appointment-chat.repository';
import { AppointmentChatGateway } from '../../../presentation/web-socket/appointment-chat/appointment-chat.gateway';
import { WsJwtAuthGuard } from '../../../presentation/web-socket/appointment-chat/guards/ws-jwt-auth.guard';
import { PrismaAppointmentChatRepository } from '../../persistence/repositories/appointment-chat/prisma-appointment-chat.repository';
import { AppointmentChatRealtimeEventBus } from '../../web-socket/appointment-chat/appointment-chat-realtime.event-bus';
import { SocketIoAppointmentChatRealtimePublisher } from '../../web-socket/appointment-chat/socket-io-appointment-chat-realtime.publisher';
import { AppointmentModule } from '../appointment/appointment.module';
import { AppointmentChatMessageModule } from '../appointment-chat-message/appointment-chat-message.module';

@Module({
  imports: [
    forwardRef(() => MastersModule),
    forwardRef(() => ImageModule),
    forwardRef(() => AppointmentModule),
    forwardRef(() => AppointmentChatMessageModule),
    UsersModule,
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
        profileRepo: IMasterProfileRepository,
        personalNoteRepo: IUserPersonalNoteRepository,
        messageRepo: IAppointmentChatMessageRepository,
      ) =>
        new GetAppointmentChatByIdUseCase(
          chatRepo,
          profileRepo,
          personalNoteRepo,
          messageRepo,
        ),
      inject: [
        APPOINTMENT_CHAT_REPOSITORY_TOKEN,
        MASTER_PROFILE_REPOSITORY_TOKEN,
        USER_PERSONAL_NOTE_REPOSITORY_TOKEN,
        APPOINTMENT_CHAT_MESSAGE_REPOSITORY_TOKEN,
      ],
    },
    {
      provide: AssertAppointmentChatAccessUseCase,
      useFactory: (
        chatRepo: IAppointmentChatRepository,
        profileRepo: IMasterProfileRepository,
      ) => new AssertAppointmentChatAccessUseCase(chatRepo, profileRepo),
      inject: [
        APPOINTMENT_CHAT_REPOSITORY_TOKEN,
        MASTER_PROFILE_REPOSITORY_TOKEN,
      ],
    },
    {
      provide: GetAppointmentChatMessageWindowUseCase,
      useFactory: (
        assertAccess: AssertAppointmentChatAccessUseCase,
        messageRepo: IAppointmentChatMessageRepository,
      ) =>
        new GetAppointmentChatMessageWindowUseCase(assertAccess, messageRepo),
      inject: [
        AssertAppointmentChatAccessUseCase,
        APPOINTMENT_CHAT_MESSAGE_REPOSITORY_TOKEN,
      ],
    },
    {
      provide: MarkAppointmentChatReadUseCase,
      useFactory: (
        transactionManager: ITransactionManager,
        chatRepo: IAppointmentChatRepository,
        profileRepo: IMasterProfileRepository,
        realtimePublisher: IAppointmentChatRealtimePublisher,
      ) =>
        new MarkAppointmentChatReadUseCase(
          transactionManager,
          chatRepo,
          profileRepo,
          realtimePublisher,
        ),
      inject: [
        TRANSACTION_MANAGER_TOKEN,
        APPOINTMENT_CHAT_REPOSITORY_TOKEN,
        MASTER_PROFILE_REPOSITORY_TOKEN,
        APPOINTMENT_CHAT_REALTIME_PUBLISHER_TOKEN,
      ],
    },
    {
      provide: DeleteAppointmentChatByIdUseCase,
      useFactory: (
        transactionManager: ITransactionManager,
        chatRepo: IAppointmentChatRepository,
        profileRepo: IMasterProfileRepository,
      ) =>
        new DeleteAppointmentChatByIdUseCase(
          transactionManager,
          chatRepo,
          profileRepo,
        ),
      inject: [
        TRANSACTION_MANAGER_TOKEN,
        APPOINTMENT_CHAT_REPOSITORY_TOKEN,
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
    GetAppointmentChatMessageWindowUseCase,
    AssertAppointmentChatAccessUseCase,
    MarkAppointmentChatReadUseCase,
    DeleteAppointmentChatByIdUseCase,
  ],
})
export class AppointmentChatModule {}

import { Module, forwardRef } from '@nestjs/common';
import { TRANSACTION_MANAGER_TOKEN } from '@shared/domain/transactions';
import type { ITransactionManager } from '@shared/domain/transactions';
import type { IMasterProfileRepository } from '../../../../masters/domain/repositories/master-profile/i-master-profile.repository';
import { MASTER_PROFILE_REPOSITORY_TOKEN } from '../../../../masters/domain/repositories/master-profile/master-profile.repository.tokens';
import { MastersModule } from '../../../../masters/masters.module';
import { APPOINTMENT_CHAT_REALTIME_PUBLISHER_TOKEN } from '../../../application/ports/appointment-chat-realtime.publisher.tokens';
import type { IAppointmentChatRealtimePublisher } from '../../../application/ports/i-appointment-chat-realtime.publisher';
import { CreateAppointmentChatMessageUseCase } from '../../../application/use-cases/appointment-chat-message/create-appointment-chat-message.use-case';
import { DeleteAppointmentChatMessageByIdUseCase } from '../../../application/use-cases/appointment-chat-message/delete-appointment-chat-message-by-id.use-case';
import { GetAppointmentChatMessageByIdUseCase } from '../../../application/use-cases/appointment-chat-message/get-appointment-chat-message-by-id.use-case';
import { GetAppointmentChatMessagesUseCase } from '../../../application/use-cases/appointment-chat-message/get-appointment-chat-messages.use-case';
import { APPOINTMENT_CHAT_MESSAGE_REPOSITORY_TOKEN } from '../../../domain/repositories/appointment-chat-message/appointment-chat-message.repository.tokens';
import type { IAppointmentChatMessageRepository } from '../../../domain/repositories/appointment-chat-message/i-appointment-chat-message.repository';
import { APPOINTMENT_CHAT_REPOSITORY_TOKEN } from '../../../domain/repositories/appointment-chat/appointment-chat.repository.tokens';
import type { IAppointmentChatRepository } from '../../../domain/repositories/appointment-chat/i-appointment-chat.repository';
import { APPOINTMENT_REPOSITORY_TOKEN } from '../../../domain/repositories/appointment/appointment.repository.tokens';
import type { IAppointmentRepository } from '../../../domain/repositories/appointment/i-appointment.repository';
import { PrismaAppointmentChatMessageRepository } from '../../persistence/repositories/appointment-chat-message/prisma-appointment-chat-message.repository';
import { AppointmentChatModule } from '../appointment-chat/appointment-chat.module';
import { AppointmentModule } from '../appointment/appointment.module';

@Module({
  imports: [
    forwardRef(() => MastersModule),
    forwardRef(() => AppointmentModule),
    forwardRef(() => AppointmentChatModule),
  ],
  providers: [
    {
      provide: APPOINTMENT_CHAT_MESSAGE_REPOSITORY_TOKEN,
      useClass: PrismaAppointmentChatMessageRepository,
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
        transactionManager: ITransactionManager,
        messageRepo: IAppointmentChatMessageRepository,
        chatRepo: IAppointmentChatRepository,
        appointmentRepo: IAppointmentRepository,
        profileRepo: IMasterProfileRepository,
        realtimePublisher: IAppointmentChatRealtimePublisher,
      ) =>
        new CreateAppointmentChatMessageUseCase(
          transactionManager,
          messageRepo,
          chatRepo,
          appointmentRepo,
          profileRepo,
          realtimePublisher,
        ),
      inject: [
        TRANSACTION_MANAGER_TOKEN,
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
        transactionManager: ITransactionManager,
        messageRepo: IAppointmentChatMessageRepository,
        chatRepo: IAppointmentChatRepository,
        appointmentRepo: IAppointmentRepository,
        profileRepo: IMasterProfileRepository,
        realtimePublisher: IAppointmentChatRealtimePublisher,
      ) =>
        new DeleteAppointmentChatMessageByIdUseCase(
          transactionManager,
          messageRepo,
          chatRepo,
          appointmentRepo,
          profileRepo,
          realtimePublisher,
        ),
      inject: [
        TRANSACTION_MANAGER_TOKEN,
        APPOINTMENT_CHAT_MESSAGE_REPOSITORY_TOKEN,
        APPOINTMENT_CHAT_REPOSITORY_TOKEN,
        APPOINTMENT_REPOSITORY_TOKEN,
        MASTER_PROFILE_REPOSITORY_TOKEN,
        APPOINTMENT_CHAT_REALTIME_PUBLISHER_TOKEN,
      ],
    },
  ],
  exports: [
    APPOINTMENT_CHAT_MESSAGE_REPOSITORY_TOKEN,
    GetAppointmentChatMessagesUseCase,
    GetAppointmentChatMessageByIdUseCase,
    CreateAppointmentChatMessageUseCase,
    DeleteAppointmentChatMessageByIdUseCase,
  ],
})
export class AppointmentChatMessageModule {}

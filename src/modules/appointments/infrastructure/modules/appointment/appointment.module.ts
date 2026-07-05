import { Module, forwardRef } from '@nestjs/common';
import { TRANSACTION_MANAGER_TOKEN } from '@shared/domain/transactions';
import type { ITransactionManager } from '@shared/domain/transactions';
import type { IMasterProfileRepository } from '../../../../masters/domain/repositories/master-profile/i-master-profile.repository';
import { MASTER_PROFILE_REPOSITORY_TOKEN } from '../../../../masters/domain/repositories/master-profile/master-profile.repository.tokens';
import type { IMasterServiceRepository } from '../../../../masters/domain/repositories/master-service/i-master-service.repository';
import { MASTER_SERVICE_REPOSITORY_TOKEN } from '../../../../masters/domain/repositories/master-service/master-service.repository.tokens';
import { MastersModule } from '../../../../masters/masters.module';
import { CreateAppointmentUseCase } from '../../../application/use-cases/appointment/create-appointment.use-case';
import { DeleteAppointmentByIdUseCase } from '../../../application/use-cases/appointment/delete-appointment-by-id.use-case';
import { GetAppointmentByIdUseCase } from '../../../application/use-cases/appointment/get-appointment-by-id.use-case';
import { GetAppointmentsUseCase } from '../../../application/use-cases/appointment/get-appointments.use-case';
import { GetMyAppointmentsUseCase } from '../../../application/use-cases/appointment/get-my-appointments.use-case';
import { GetMyClientsAppointmentsUseCase } from '../../../application/use-cases/appointment/get-my-clients-appointments.use-case';
import { UpdateAppointmentByIdUseCase } from '../../../application/use-cases/appointment/update-appointment-by-id.use-case';
import { APPOINTMENT_REPOSITORY_TOKEN } from '../../../domain/repositories/appointment/appointment.repository.tokens';
import type { IAppointmentRepository } from '../../../domain/repositories/appointment/i-appointment.repository';
import type { IAppointmentChatRepository } from '../../../domain/repositories/appointment-chat/i-appointment-chat.repository';
import { APPOINTMENT_CHAT_REPOSITORY_TOKEN } from '../../../domain/repositories/appointment-chat/appointment-chat.repository.tokens';
import type { IAppointmentChatMessageRepository } from '../../../domain/repositories/appointment-chat-message/i-appointment-chat-message.repository';
import { APPOINTMENT_CHAT_MESSAGE_REPOSITORY_TOKEN } from '../../../domain/repositories/appointment-chat-message/appointment-chat-message.repository.tokens';
import { PrismaAppointmentRepository } from '../../persistence/repositories/appointment/prisma-appointment.repository';
import { AppointmentChatModule } from '../appointment-chat/appointment-chat.module';
import { AppointmentChatMessageModule } from '../appointment-chat-message/appointment-chat-message.module';

@Module({
  imports: [
    forwardRef(() => MastersModule),
    forwardRef(() => AppointmentChatModule),
    forwardRef(() => AppointmentChatMessageModule),
  ],
  providers: [
    {
      provide: APPOINTMENT_REPOSITORY_TOKEN,
      useClass: PrismaAppointmentRepository,
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
        transactionManager: ITransactionManager,
        appointmentRepo: IAppointmentRepository,
        chatRepo: IAppointmentChatRepository,
        messageRepo: IAppointmentChatMessageRepository,
        profileRepo: IMasterProfileRepository,
        serviceRepo: IMasterServiceRepository,
      ) =>
        new CreateAppointmentUseCase(
          transactionManager,
          appointmentRepo,
          chatRepo,
          messageRepo,
          profileRepo,
          serviceRepo,
        ),
      inject: [
        TRANSACTION_MANAGER_TOKEN,
        APPOINTMENT_REPOSITORY_TOKEN,
        APPOINTMENT_CHAT_REPOSITORY_TOKEN,
        APPOINTMENT_CHAT_MESSAGE_REPOSITORY_TOKEN,
        MASTER_PROFILE_REPOSITORY_TOKEN,
        MASTER_SERVICE_REPOSITORY_TOKEN,
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
    GetAppointmentsUseCase,
    GetMyAppointmentsUseCase,
    GetMyClientsAppointmentsUseCase,
    GetAppointmentByIdUseCase,
    CreateAppointmentUseCase,
    UpdateAppointmentByIdUseCase,
    DeleteAppointmentByIdUseCase,
  ],
})
export class AppointmentModule {}

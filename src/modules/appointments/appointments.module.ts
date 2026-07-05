import { Module, forwardRef } from '@nestjs/common';
import { AuthGuardsModule } from '../auth/infrastructure/modules/auth-guards/auth-guards.module';
import { AuthorizationModule } from '../authorization/authorization.module';
import { MastersModule } from '../masters/masters.module';
import { UsersModule } from '../users/users.module';
import { AppointmentChatMessageModule } from './infrastructure/modules/appointment-chat-message/appointment-chat-message.module';
import { AppointmentChatModule } from './infrastructure/modules/appointment-chat/appointment-chat.module';
import { AppointmentModule } from './infrastructure/modules/appointment/appointment.module';
import { AppointmentChatMessagesController } from './presentation/http/controllers/appointment-chat-messages.controller';
import { AppointmentChatsController } from './presentation/http/controllers/appointment-chats.controller';
import { AppointmentsController } from './presentation/http/controllers/appointments.controller';

@Module({
  imports: [
    forwardRef(() => MastersModule),
    UsersModule,
    AuthGuardsModule,
    AuthorizationModule,
    AppointmentModule,
    AppointmentChatModule,
    AppointmentChatMessageModule,
  ],
  controllers: [
    AppointmentsController,
    AppointmentChatsController,
    AppointmentChatMessagesController,
  ],
  exports: [
    AppointmentModule,
    AppointmentChatModule,
    AppointmentChatMessageModule,
  ],
})
export class AppointmentsModule {}

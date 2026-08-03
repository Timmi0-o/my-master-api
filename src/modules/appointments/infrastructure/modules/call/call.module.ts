import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { WebPushSubscriptionsModule } from '@modules/web-push-subscriptions/web-push-subscriptions.module';
import { USER_REPOSITORY_TOKEN } from 'src/modules/users/domain/repositories/user/user.repository.tokens';
import { PrismaUserRepository } from 'src/modules/users/infrastructure/persistence/repositories/user/prisma-user.repository';
import { UsersModule } from 'src/modules/users/users.module';
import type { IMasterProfileRepository } from '../../../../masters/domain/repositories/master-profile/i-master-profile.repository';
import { MASTER_PROFILE_REPOSITORY_TOKEN } from '../../../../masters/domain/repositories/master-profile/master-profile.repository.tokens';
import { MastersModule } from '../../../../masters/masters.module';
import { ResolveCallParticipantsUseCase } from '../../../application/use-cases/call/resolve-call-participants.use-case';
import { APPOINTMENT_CHAT_REPOSITORY_TOKEN } from '../../../domain/repositories/appointment-chat/appointment-chat.repository.tokens';
import type { IAppointmentChatRepository } from '../../../domain/repositories/appointment-chat/i-appointment-chat.repository';
import { CallGateway } from '../../../presentation/web-socket/call/call.gateway';
import { CallWsJwtAuthGuard } from '../../../presentation/web-socket/call/guards/call-ws-jwt-auth.guard';
import { CallRingTimeoutProcessor } from '../../web-socket/call/call-ring-timeout.processor';
import { CallSessionService } from '../../web-socket/call/call-session.service';
import { AppointmentChatModule } from '../appointment-chat/appointment-chat.module';

@Module({
  imports: [
    forwardRef(() => MastersModule),
    UsersModule,
    JwtModule.register({}),
    AppointmentChatModule,
    WebPushSubscriptionsModule,
  ],
  providers: [
    CallGateway,
    CallWsJwtAuthGuard,
    CallSessionService,
    CallRingTimeoutProcessor,
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: PrismaUserRepository,
    },
    {
      provide: ResolveCallParticipantsUseCase,
      useFactory: (
        chatRepo: IAppointmentChatRepository,
        profileRepo: IMasterProfileRepository,
      ) => new ResolveCallParticipantsUseCase(chatRepo, profileRepo),
      inject: [
        APPOINTMENT_CHAT_REPOSITORY_TOKEN,
        MASTER_PROFILE_REPOSITORY_TOKEN,
      ],
    },
  ],
  exports: [CallGateway, CallSessionService, ResolveCallParticipantsUseCase],
})
export class CallModule {}

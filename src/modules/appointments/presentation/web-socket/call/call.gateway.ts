import { ResolveCallParticipantsUseCase } from '@modules/appointments/application/use-cases/call/resolve-call-participants.use-case';
import { CallSessionService } from '@modules/appointments/infrastructure/web-socket/call/call-session.service';
import {
  BadRequestException,
  type OnModuleInit,
  UseGuards,
} from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import type { Server } from 'socket.io';
import { isStaffRoleIdentifier } from 'src/modules/authorization/domain/policies/is-staff-role-identifier.policy';
import { toAppointmentActor } from '../../http/request-mappers/shared/to-appointment-actor';
import {
  CALL_WS_EVENTS,
  CALL_WS_USER_ROOM_NAME,
  type TCallEndReason,
} from './call-ws.events';
import type { CallAuthenticatedSocket } from './guards/call-authenticated-socket.types';
import { CallWsJwtAuthGuard } from './guards/call-ws-jwt-auth.guard';
import { mapWsErrorResponse } from './mappers/map-ws-error-response';
import {
  validateCallAnswerPayload,
  validateCallIcePayload,
  validateCallIdPayload,
  validateCallOfferPayload,
  validateInviteCallPayload,
} from './validation/validate-call-payload';

@WebSocketGateway({
  namespace: '/v1/calls',
  cors: { origin: process.env.WS_CORS_ORIGIN ?? '*' },
})
export class CallGateway
  implements
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnModuleInit
{
  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly callWsJwtAuthGuard: CallWsJwtAuthGuard,
    private readonly callSessionService: CallSessionService,
    private readonly resolveCallParticipantsUseCase: ResolveCallParticipantsUseCase,
  ) {}

  onModuleInit(): void {
    this.callSessionService.setRingTimeoutHandler((session) => {
      this.emitEnded(session.callerUserId, session.calleeUserId, {
        callId: session.callId,
        chatId: session.chatId,
        reason: 'timeout',
      });
    });
  }

  afterInit(server: Server): void {
    this.server = server;
  }

  async handleConnection(client: CallAuthenticatedSocket): Promise<void> {
    const user = await this.callWsJwtAuthGuard.resolveUser(client);
    if (!user) {
      client.disconnect(true);
      return;
    }

    client.data.user = user;
    await client.join(CALL_WS_USER_ROOM_NAME(user.id));
  }

  handleDisconnect(client: CallAuthenticatedSocket): void {
    const userId = client.data?.user?.id;
    if (!userId) {
      return;
    }

    const session = this.callSessionService.removeByDisconnect(userId);
    if (!session) {
      return;
    }

    const peerUserId = this.callSessionService.getPeerUserId(session, userId);
    if (!peerUserId) {
      return;
    }

    this.emitEnded(peerUserId, null, {
      callId: session.callId,
      chatId: session.chatId,
      reason: 'disconnect',
    });
  }

  @SubscribeMessage(CALL_WS_EVENTS.INVITE)
  @UseGuards(CallWsJwtAuthGuard)
  async invite(
    @ConnectedSocket() client: CallAuthenticatedSocket,
    @MessageBody() body: Record<string, unknown>,
  ) {
    try {
      const payload = validateInviteCallPayload(body);
      const user = client.data.user;

      if (this.callSessionService.isUserBusy(user.id)) {
        throw new BadRequestException('Вы уже в звонке');
      }

      const participants = await this.resolveCallParticipantsUseCase.execute({
        chatId: payload.chatId,
        actor: toAppointmentActor(
          user,
          isStaffRoleIdentifier(user.roleIdentifier),
        ),
      });

      if (this.callSessionService.isUserBusy(participants.calleeUserId)) {
        this.server
          .to(CALL_WS_USER_ROOM_NAME(user.id))
          .emit(CALL_WS_EVENTS.BUSY, {
            result: {
              data: {
                chatId: payload.chatId,
                media: payload.media,
              },
            },
          });

        return {
          result: {
            data: {
              busy: true as const,
              chatId: payload.chatId,
            },
          },
        };
      }

      const session = this.callSessionService.createRinging({
        chatId: participants.chatId,
        callerUserId: participants.callerUserId,
        calleeUserId: participants.calleeUserId,
        media: payload.media,
      });

      this.server
        .to(CALL_WS_USER_ROOM_NAME(session.calleeUserId))
        .emit(CALL_WS_EVENTS.INCOMING, {
          result: {
            data: {
              callId: session.callId,
              chatId: session.chatId,
              media: session.media,
              callerUserId: session.callerUserId,
            },
          },
        });

      return {
        result: {
          data: {
            callId: session.callId,
            chatId: session.chatId,
            media: session.media,
            calleeUserId: session.calleeUserId,
            status: session.status,
          },
        },
      };
    } catch (error) {
      return mapWsErrorResponse(error);
    }
  }

  @SubscribeMessage(CALL_WS_EVENTS.ACCEPT)
  @UseGuards(CallWsJwtAuthGuard)
  accept(
    @ConnectedSocket() client: CallAuthenticatedSocket,
    @MessageBody() body: Record<string, unknown>,
  ) {
    try {
      const payload = validateCallIdPayload(body);
      const session = this.callSessionService.accept(
        payload.callId,
        client.data.user.id,
      );

      if (!session) {
        throw new BadRequestException('Звонок недоступен для принятия');
      }

      this.server
        .to(CALL_WS_USER_ROOM_NAME(session.callerUserId))
        .emit(CALL_WS_EVENTS.ACCEPTED, {
          result: {
            data: {
              callId: session.callId,
              chatId: session.chatId,
              media: session.media,
              calleeUserId: session.calleeUserId,
            },
          },
        });

      return {
        result: {
          data: {
            callId: session.callId,
            chatId: session.chatId,
            media: session.media,
            status: session.status,
          },
        },
      };
    } catch (error) {
      return mapWsErrorResponse(error);
    }
  }

  @SubscribeMessage(CALL_WS_EVENTS.REJECT)
  @UseGuards(CallWsJwtAuthGuard)
  reject(
    @ConnectedSocket() client: CallAuthenticatedSocket,
    @MessageBody() body: Record<string, unknown>,
  ) {
    try {
      const payload = validateCallIdPayload(body);
      const existing = this.callSessionService.findById(payload.callId);

      if (
        !existing ||
        existing.status !== 'ringing' ||
        existing.calleeUserId !== client.data.user.id
      ) {
        throw new BadRequestException('Звонок недоступен для отклонения');
      }

      const removed = this.callSessionService.removeIfParticipant(
        payload.callId,
        client.data.user.id,
      );

      if (!removed) {
        throw new BadRequestException('Звонок недоступен для отклонения');
      }

      const rejectedPayload = {
        result: {
          data: {
            callId: removed.session.callId,
            chatId: removed.session.chatId,
          },
        },
      };

      const endedPayload = {
        result: {
          data: {
            callId: removed.session.callId,
            chatId: removed.session.chatId,
            reason: 'reject' as const,
          },
        },
      };

      // Caller должен закрыть UI даже если callId ещё не пришёл в ack.
      this.server
        .to(CALL_WS_USER_ROOM_NAME(removed.session.callerUserId))
        .emit(CALL_WS_EVENTS.REJECTED, rejectedPayload);

      this.server
        .to(CALL_WS_USER_ROOM_NAME(removed.session.callerUserId))
        .emit(CALL_WS_EVENTS.ENDED, endedPayload);

      client.emit(CALL_WS_EVENTS.ENDED, endedPayload);

      return {
        result: {
          data: {
            callId: removed.session.callId,
            rejected: true as const,
          },
        },
      };
    } catch (error) {
      return mapWsErrorResponse(error);
    }
  }

  @SubscribeMessage(CALL_WS_EVENTS.OFFER)
  @UseGuards(CallWsJwtAuthGuard)
  offer(
    @ConnectedSocket() client: CallAuthenticatedSocket,
    @MessageBody() body: Record<string, unknown>,
  ) {
    try {
      const payload = validateCallOfferPayload(body);
      this.relaySignaling(
        client.data.user.id,
        payload.callId,
        CALL_WS_EVENTS.OFFER,
        {
          callId: payload.callId,
          sdp: payload.sdp,
        },
      );
      return { result: { data: { relayed: true as const } } };
    } catch (error) {
      return mapWsErrorResponse(error);
    }
  }

  @SubscribeMessage(CALL_WS_EVENTS.ANSWER)
  @UseGuards(CallWsJwtAuthGuard)
  answer(
    @ConnectedSocket() client: CallAuthenticatedSocket,
    @MessageBody() body: Record<string, unknown>,
  ) {
    try {
      const payload = validateCallAnswerPayload(body);
      this.relaySignaling(
        client.data.user.id,
        payload.callId,
        CALL_WS_EVENTS.ANSWER,
        {
          callId: payload.callId,
          sdp: payload.sdp,
        },
      );
      return { result: { data: { relayed: true as const } } };
    } catch (error) {
      return mapWsErrorResponse(error);
    }
  }

  @SubscribeMessage(CALL_WS_EVENTS.ICE)
  @UseGuards(CallWsJwtAuthGuard)
  ice(
    @ConnectedSocket() client: CallAuthenticatedSocket,
    @MessageBody() body: Record<string, unknown>,
  ) {
    try {
      const payload = validateCallIcePayload(body);
      this.relaySignaling(
        client.data.user.id,
        payload.callId,
        CALL_WS_EVENTS.ICE,
        {
          callId: payload.callId,
          candidate: payload.candidate,
        },
      );
      return { result: { data: { relayed: true as const } } };
    } catch (error) {
      return mapWsErrorResponse(error);
    }
  }

  @SubscribeMessage(CALL_WS_EVENTS.END)
  @UseGuards(CallWsJwtAuthGuard)
  end(
    @ConnectedSocket() client: CallAuthenticatedSocket,
    @MessageBody() body: Record<string, unknown>,
  ) {
    try {
      const payload = validateCallIdPayload(body);

      const removed = this.callSessionService.removeIfParticipant(
        payload.callId,
        client.data.user.id,
      );

      if (!removed) {
        throw new BadRequestException('Звонок не найден');
      }

      const endedPayload = {
        result: {
          data: {
            callId: removed.session.callId,
            chatId: removed.session.chatId,
            reason: removed.reason,
          },
        },
      };

      const peerUserId = this.callSessionService.getPeerUserId(
        removed.session,
        client.data.user.id,
      );

      // Сначала peer — чтобы UI закрылся у второго участника сразу.
      if (peerUserId) {
        this.server
          .to(CALL_WS_USER_ROOM_NAME(peerUserId))
          .emit(CALL_WS_EVENTS.ENDED, endedPayload);
      }

      // И инициатору (другие вкладки / локальный listener).
      client.emit(CALL_WS_EVENTS.ENDED, endedPayload);
      this.server
        .to(CALL_WS_USER_ROOM_NAME(client.data.user.id))
        .emit(CALL_WS_EVENTS.ENDED, endedPayload);

      return {
        result: {
          data: {
            callId: removed.session.callId,
            ended: true as const,
          },
        },
      };
    } catch (error) {
      console.log('error END CALL', error);

      return mapWsErrorResponse(error);
    }
  }

  private relaySignaling(
    senderUserId: string,
    callId: string,
    event: string,
    data: Record<string, unknown>,
  ): void {
    const session = this.callSessionService.findById(callId);
    if (
      !session ||
      !this.callSessionService.assertParticipant(session, senderUserId)
    ) {
      throw new BadRequestException('Звонок не найден');
    }

    const peerUserId = this.callSessionService.getPeerUserId(
      session,
      senderUserId,
    );
    if (!peerUserId) {
      throw new BadRequestException('Участник звонка не найден');
    }

    this.server.to(CALL_WS_USER_ROOM_NAME(peerUserId)).emit(event, {
      result: { data },
    });
  }

  private emitEnded(
    userIdA: string,
    userIdB: string | null,
    data: { callId: string; chatId: string; reason: TCallEndReason },
  ): void {
    this.server.to(CALL_WS_USER_ROOM_NAME(userIdA)).emit(CALL_WS_EVENTS.ENDED, {
      result: { data },
    });

    if (userIdB) {
      this.server
        .to(CALL_WS_USER_ROOM_NAME(userIdB))
        .emit(CALL_WS_EVENTS.ENDED, {
          result: { data },
        });
    }
  }
}

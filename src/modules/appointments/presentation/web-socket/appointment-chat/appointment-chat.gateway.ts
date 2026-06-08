import { type OnModuleDestroy, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import type { Subscription } from 'rxjs';
import type { Server } from 'socket.io';
import { AssertAppointmentChatAccessUseCase } from '../../../application/use-cases/appointment-chat/assert-appointment-chat-access.use-case';
import { AppointmentChatRealtimeEventBus } from '../../../infrastructure/web-socket/appointment-chat/appointment-chat-realtime.event-bus';
import {
  APPOINTMENT_CHAT_WS_EVENTS,
  APPOINTMENT_CHAT_WS_ROOM_NAME,
} from './appointment-chat-ws.events';
import type { AppointmentChatAuthenticatedSocket } from './guards/appointment-chat-authenticated-socket.types';
import { WsJwtAuthGuard } from './guards/ws-jwt-auth.guard';
import { mapAppointmentChatMessageToWsPayload } from './mappers/map-appointment-chat-message-to-ws-payload';
import { mapWsErrorResponse } from './mappers/map-ws-error-response';
import { payloadToAssertAppointmentChatAccessInput } from './mappers/payload-to-assert-appointment-chat-access-input';
import { AppointmentChatWsValidator } from './validation/appointment-chat-ws.validator';

@WebSocketGateway({
  namespace: '/v1/appointment-chats',
  cors: { origin: process.env.WS_CORS_ORIGIN ?? '*' },
})
export class AppointmentChatGateway implements OnGatewayInit, OnModuleDestroy {
  @WebSocketServer()
  server!: Server;

  private eventBusSubscription?: Subscription;

  constructor(
    private readonly eventBus: AppointmentChatRealtimeEventBus,
    private readonly wsJwtAuthGuard: WsJwtAuthGuard,
    private readonly wsValidator: AppointmentChatWsValidator,
    private readonly assertAccessUseCase: AssertAppointmentChatAccessUseCase,
  ) {}

  afterInit(server: Server): void {
    this.server = server;

    this.eventBusSubscription = this.eventBus.subscribe((event) => {
      const room = APPOINTMENT_CHAT_WS_ROOM_NAME(event.chatId);

      if (event.type === 'message.created') {
        server.to(room).emit(APPOINTMENT_CHAT_WS_EVENTS.MESSAGE_CREATED, {
          result: {
            data: event.message
              ? mapAppointmentChatMessageToWsPayload(event.message)
              : null,
          },
        });
        return;
      }

      server.to(room).emit(APPOINTMENT_CHAT_WS_EVENTS.MESSAGE_DELETED, {
        result: {
          data: {
            chatId: event.chatId,
            messageId: event.messageId,
          },
        },
      });
    });
  }

  onModuleDestroy(): void {
    this.eventBusSubscription?.unsubscribe();
  }

  async handleConnection(
    client: AppointmentChatAuthenticatedSocket,
  ): Promise<void> {
    const user = await this.wsJwtAuthGuard.resolveUser(client);
    if (!user) {
      client.disconnect(true);
      return;
    }

    client.data.user = user;
  }

  @SubscribeMessage(APPOINTMENT_CHAT_WS_EVENTS.JOIN)
  @UseGuards(WsJwtAuthGuard)
  async join(
    @ConnectedSocket() client: AppointmentChatAuthenticatedSocket,
    @MessageBody() body: Record<string, unknown>,
  ) {
    try {
      const payload = this.wsValidator.validateJoinPayload(body);

      await this.assertAccessUseCase.execute(
        payloadToAssertAppointmentChatAccessInput(payload, client.data.user),
      );

      await client.join(APPOINTMENT_CHAT_WS_ROOM_NAME(payload.chatId));

      return { result: { data: { joined: true } } };
    } catch (error) {
      return mapWsErrorResponse(error);
    }
  }

  @SubscribeMessage(APPOINTMENT_CHAT_WS_EVENTS.LEAVE)
  @UseGuards(WsJwtAuthGuard)
  async leave(
    @ConnectedSocket() client: AppointmentChatAuthenticatedSocket,
    @MessageBody() body: Record<string, unknown>,
  ) {
    try {
      const payload = this.wsValidator.validateLeavePayload(body);
      await client.leave(APPOINTMENT_CHAT_WS_ROOM_NAME(payload.chatId));

      return { result: { data: { left: true } } };
    } catch (error) {
      return mapWsErrorResponse(error);
    }
  }
}

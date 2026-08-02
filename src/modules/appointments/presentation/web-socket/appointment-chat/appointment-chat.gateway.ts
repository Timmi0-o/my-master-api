import { AssertAppointmentChatAccessUseCase } from '@modules/appointments/application/use-cases/appointment-chat/assert-appointment-chat-access.use-case';
import { AppointmentChatRealtimeEventBus } from '@modules/appointments/infrastructure/web-socket/appointment-chat/appointment-chat-realtime.event-bus';
import { type OnModuleDestroy, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import type { Subscription } from 'rxjs';
import type { Server } from 'socket.io';
import {
  APPOINTMENT_CHAT_WS_EVENTS,
  APPOINTMENT_CHAT_WS_ROOM_NAME,
  APPOINTMENT_CHAT_WS_USER_ROOM_NAME,
} from './appointment-chat-ws.events';
import type { AppointmentChatAuthenticatedSocket } from './guards/appointment-chat-authenticated-socket.types';
import { WsJwtAuthGuard } from './guards/ws-jwt-auth.guard';
import { mapAppointmentChatMessageToWsPayload } from './mappers/map-appointment-chat-message-to-ws-payload';
import { mapAppointmentChatReadToWsPayload } from './mappers/map-appointment-chat-read-to-ws-payload';
import { mapWsErrorResponse } from './mappers/map-ws-error-response';
import { requestBodyToAssertAppointmentChatAccessUseCaseInput } from './mappers/request-body-to-assert-appointment-chat-access-use-case-input';
import { validateJoinAppointmentChatPayload } from './validation/validate-join-appointment-chat-payload';

@WebSocketGateway({
  namespace: '/v1/appointment-chats',
  cors: { origin: process.env.WS_CORS_ORIGIN ?? '*' },
})
export class AppointmentChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnModuleDestroy
{
  @WebSocketServer()
  server!: Server;

  private eventBusSubscription?: Subscription;

  constructor(
    private readonly eventBus: AppointmentChatRealtimeEventBus,
    private readonly wsJwtAuthGuard: WsJwtAuthGuard,
    private readonly assertAccessUseCase: AssertAppointmentChatAccessUseCase,
  ) {}

  afterInit(server: Server): void {
    this.server = server;

    this.eventBusSubscription = this.eventBus.subscribe((event) => {
      const room = APPOINTMENT_CHAT_WS_ROOM_NAME(event.chatId);

      if (event.type === 'message.created') {
        const payload = {
          result: {
            data: event.message
              ? mapAppointmentChatMessageToWsPayload(event.message)
              : null,
          },
        };

        server
          .to(room)
          .emit(APPOINTMENT_CHAT_WS_EVENTS.MESSAGE_CREATED, payload);

        if (event.recipientUserId) {
          server
            .to(APPOINTMENT_CHAT_WS_USER_ROOM_NAME(event.recipientUserId))
            .emit(APPOINTMENT_CHAT_WS_EVENTS.INBOX_MESSAGE, payload);
        }
        return;
      }

      if (event.type === 'chat.read') {
        server.to(room).emit(APPOINTMENT_CHAT_WS_EVENTS.READ, {
          result: {
            data: mapAppointmentChatReadToWsPayload(event),
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
    await client.join(APPOINTMENT_CHAT_WS_USER_ROOM_NAME(user.id));
  }

  @SubscribeMessage(APPOINTMENT_CHAT_WS_EVENTS.SUBSCRIBE_INBOX)
  @UseGuards(WsJwtAuthGuard)
  async subscribeInbox(
    @ConnectedSocket() client: AppointmentChatAuthenticatedSocket,
  ) {
    try {
      await client.join(
        APPOINTMENT_CHAT_WS_USER_ROOM_NAME(client.data.user.id),
      );
      return { result: { data: { subscribed: true } } };
    } catch (error) {
      return mapWsErrorResponse(error);
    }
  }

  @SubscribeMessage(APPOINTMENT_CHAT_WS_EVENTS.JOIN)
  @UseGuards(WsJwtAuthGuard)
  async join(
    @ConnectedSocket() client: AppointmentChatAuthenticatedSocket,
    @MessageBody() body: Record<string, unknown>,
  ) {
    try {
      const payload = validateJoinAppointmentChatPayload(
        body,
        'Некорректные данные для подключения к чату',
      );

      await this.assertAccessUseCase.execute(
        requestBodyToAssertAppointmentChatAccessUseCaseInput(payload, client.data.user),
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
      const payload = validateJoinAppointmentChatPayload(
        body,
        'Некорректные данные для выхода из чата',
      );
      await client.leave(APPOINTMENT_CHAT_WS_ROOM_NAME(payload.chatId));

      return { result: { data: { left: true } } };
    } catch (error) {
      return mapWsErrorResponse(error);
    }
  }
}

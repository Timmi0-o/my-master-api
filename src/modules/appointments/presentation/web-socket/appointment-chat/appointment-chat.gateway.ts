import { Inject, type OnModuleDestroy, UseGuards } from '@nestjs/common';
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
import { AssertAppointmentChatAccessUseCase } from '@modules/appointments/application/use-cases/appointment-chat/assert-appointment-chat-access.use-case';
import { AppointmentChatRealtimeEventBus } from '@modules/appointments/infrastructure/web-socket/appointment-chat/appointment-chat-realtime.event-bus';
import {
  ensureAppointmentChatAccessible,
  ensureAppointmentChatExists,
} from 'src/modules/appointments/domain/entities/appointment-chat';
import { APPOINTMENT_CHAT_REPOSITORY_TOKEN } from 'src/modules/appointments/domain/repositories/appointment-chat/appointment-chat.repository.tokens';
import type { IAppointmentChatRepository } from 'src/modules/appointments/domain/repositories/appointment-chat/i-appointment-chat.repository';
import { ensureMasterProfileExists } from 'src/modules/masters/domain/entities/master-profile';
import { MASTER_PROFILE_REPOSITORY_TOKEN } from 'src/modules/masters/domain/repositories/master-profile/master-profile.repository.tokens';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
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
    @Inject(APPOINTMENT_CHAT_REPOSITORY_TOKEN)
    private readonly appointmentChatRepository: IAppointmentChatRepository,
    @Inject(MASTER_PROFILE_REPOSITORY_TOKEN)
    private readonly masterProfileRepository: IMasterProfileRepository,
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

      if (event.type === 'message.updated') {
        server.to(room).emit(APPOINTMENT_CHAT_WS_EVENTS.MESSAGE_UPDATED, {
          result: {
            data: mapAppointmentChatMessageToWsPayload(event.message),
          },
        });
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

      const deletedPayload = {
        result: {
          data: {
            chatId: event.chatId,
            messageId: event.messageId,
            forUserId: event.forUserId ?? null,
          },
        },
      };

      server
        .to(room)
        .emit(APPOINTMENT_CHAT_WS_EVENTS.MESSAGE_DELETED, deletedPayload);

      if (event.forUserId) {
        server
          .to(APPOINTMENT_CHAT_WS_USER_ROOM_NAME(event.forUserId))
          .emit(APPOINTMENT_CHAT_WS_EVENTS.MESSAGE_DELETED, deletedPayload);
      }
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
        requestBodyToAssertAppointmentChatAccessUseCaseInput(
          payload,
          client.data.user,
        ),
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

      await this.broadcastTyping(
        client,
        payload.chatId,
        APPOINTMENT_CHAT_WS_EVENTS.TYPING_STOP,
      );

      await client.leave(APPOINTMENT_CHAT_WS_ROOM_NAME(payload.chatId));

      return { result: { data: { left: true } } };
    } catch (error) {
      return mapWsErrorResponse(error);
    }
  }

  @SubscribeMessage(APPOINTMENT_CHAT_WS_EVENTS.TYPING_START)
  @UseGuards(WsJwtAuthGuard)
  async typingStart(
    @ConnectedSocket() client: AppointmentChatAuthenticatedSocket,
    @MessageBody() body: Record<string, unknown>,
  ) {
    try {
      const payload = validateJoinAppointmentChatPayload(
        body,
        'Некорректные данные typing.start',
      );

      await this.broadcastTyping(
        client,
        payload.chatId,
        APPOINTMENT_CHAT_WS_EVENTS.TYPING_START,
      );

      return { result: { data: { ok: true } } };
    } catch (error) {
      return mapWsErrorResponse(error);
    }
  }

  @SubscribeMessage(APPOINTMENT_CHAT_WS_EVENTS.TYPING_STOP)
  @UseGuards(WsJwtAuthGuard)
  async typingStop(
    @ConnectedSocket() client: AppointmentChatAuthenticatedSocket,
    @MessageBody() body: Record<string, unknown>,
  ) {
    try {
      const payload = validateJoinAppointmentChatPayload(
        body,
        'Некорректные данные typing.stop',
      );

      await this.broadcastTyping(
        client,
        payload.chatId,
        APPOINTMENT_CHAT_WS_EVENTS.TYPING_STOP,
      );

      return { result: { data: { ok: true } } };
    } catch (error) {
      return mapWsErrorResponse(error);
    }
  }

  private async broadcastTyping(
    client: AppointmentChatAuthenticatedSocket,
    chatId: string,
    event:
      | typeof APPOINTMENT_CHAT_WS_EVENTS.TYPING_START
      | typeof APPOINTMENT_CHAT_WS_EVENTS.TYPING_STOP,
  ): Promise<void> {
    const chat = await this.appointmentChatRepository.findEntityById(chatId);
    ensureAppointmentChatExists(chat, chatId);

    const profile = await this.masterProfileRepository.findEntityById(
      chat.masterProfileId,
    );
    ensureMasterProfileExists(profile, chat.masterProfileId);
    ensureAppointmentChatAccessible(
      chat,
      { userId: client.data.user.id, isStaffUser: false },
      profile.userId,
    );

    const peerUserId =
      chat.clientUserId === client.data.user.id
        ? profile.userId
        : chat.clientUserId;

    const payload = {
      result: {
        data: {
          chatId,
          userId: client.data.user.id,
        },
      },
    };

    this.server
      .to(APPOINTMENT_CHAT_WS_ROOM_NAME(chatId))
      .except(client.id)
      .emit(event, payload);

    this.server
      .to(APPOINTMENT_CHAT_WS_USER_ROOM_NAME(peerUserId))
      .except(client.id)
      .emit(event, payload);
  }
}

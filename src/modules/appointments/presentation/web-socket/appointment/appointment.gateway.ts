import { AppointmentRealtimeEventBus } from '@modules/appointments/infrastructure/web-socket/appointment/appointment-realtime.event-bus';
import { type OnModuleDestroy, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import type { Subscription } from 'rxjs';
import type { Server } from 'socket.io';
import {
  APPOINTMENT_WS_EVENTS,
  APPOINTMENT_WS_USER_ROOM_NAME,
} from './appointment-ws.events';
import type { AppointmentAuthenticatedSocket } from './guards/appointment-authenticated-socket.types';
import { WsJwtAuthGuard } from './guards/ws-jwt-auth.guard';
import { mapAppointmentToWsPayload } from './mappers/map-appointment-to-ws-payload';
import { mapWsErrorResponse } from './mappers/map-ws-error-response';

@WebSocketGateway({
  namespace: '/v1/appointments',
  cors: { origin: process.env.WS_CORS_ORIGIN ?? '*' },
})
export class AppointmentGateway
  implements OnGatewayInit, OnGatewayConnection, OnModuleDestroy
{
  @WebSocketServer()
  server!: Server;

  private eventBusSubscription?: Subscription;

  constructor(
    private readonly eventBus: AppointmentRealtimeEventBus,
    private readonly wsJwtAuthGuard: WsJwtAuthGuard,
  ) {}

  afterInit(server: Server): void {
    this.server = server;

    this.eventBusSubscription = this.eventBus.subscribe((event) => {
      if (
        event.type !== 'appointment.created' &&
        event.type !== 'appointment.updated'
      ) {
        return;
      }

      if (!event.recipientUserId) {
        return;
      }

      const payload = {
        result: {
          data: event.appointment
            ? mapAppointmentToWsPayload(event.appointment)
            : null,
        },
      };

      const wsEvent =
        event.type === 'appointment.created'
          ? APPOINTMENT_WS_EVENTS.APPOINTMENT_CREATED
          : APPOINTMENT_WS_EVENTS.APPOINTMENT_UPDATED;

      server
        .to(APPOINTMENT_WS_USER_ROOM_NAME(event.recipientUserId))
        .emit(wsEvent, payload);
    });
  }

  onModuleDestroy(): void {
    this.eventBusSubscription?.unsubscribe();
  }

  async handleConnection(
    client: AppointmentAuthenticatedSocket,
  ): Promise<void> {
    const user = await this.wsJwtAuthGuard.resolveUser(client);
    if (!user) {
      client.disconnect(true);
      return;
    }

    client.data.user = user;
    await client.join(APPOINTMENT_WS_USER_ROOM_NAME(user.id));
  }

  @SubscribeMessage(APPOINTMENT_WS_EVENTS.SUBSCRIBE_INBOX)
  @UseGuards(WsJwtAuthGuard)
  async subscribeInbox(
    @ConnectedSocket() client: AppointmentAuthenticatedSocket,
  ) {
    try {
      await client.join(APPOINTMENT_WS_USER_ROOM_NAME(client.data.user.id));
      return { result: { data: { subscribed: true } } };
    } catch (error) {
      return mapWsErrorResponse(error);
    }
  }
}

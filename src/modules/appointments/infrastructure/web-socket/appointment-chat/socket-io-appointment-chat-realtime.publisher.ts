import { Injectable } from '@nestjs/common';
import { IAppointmentChatRealtimePublisher } from 'src/modules/appointments/application/ports/i-appointment-chat-realtime.publisher';
import type { IAppointmentChatMessagePublicEntity } from '../../../domain/entities/appointment-chat-message';
import { AppointmentChatRealtimeEventBus } from './appointment-chat-realtime.event-bus';

@Injectable()
export class SocketIoAppointmentChatRealtimePublisher implements IAppointmentChatRealtimePublisher {
  constructor(private readonly eventBus: AppointmentChatRealtimeEventBus) {}

  //eslint-disable-next-line @typescript-eslint/require-await
  async messageCreated(
    message: IAppointmentChatMessagePublicEntity,
  ): Promise<void> {
    this.eventBus.publish({
      type: 'message.created',
      chatId: message.chatId,
      message,
    });
  }

  //eslint-disable-next-line @typescript-eslint/require-await
  async messageDeleted(payload: {
    chatId: string;
    messageId: string;
  }): Promise<void> {
    this.eventBus.publish({
      type: 'message.deleted',
      chatId: payload.chatId,
      messageId: payload.messageId,
    });
  }
}

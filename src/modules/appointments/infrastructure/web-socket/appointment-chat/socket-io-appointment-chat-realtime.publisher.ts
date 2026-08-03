import { Injectable } from '@nestjs/common';
import {
  IAppointmentChatRealtimePublisher,
  type IAppointmentChatReadRealtimePayload,
} from 'src/modules/appointments/application/ports/i-appointment-chat-realtime.publisher';
import type { IAppointmentChatMessagePublicEntity } from '../../../domain/entities/appointment-chat-message';
import { AppointmentChatRealtimeEventBus } from './appointment-chat-realtime.event-bus';

@Injectable()
export class SocketIoAppointmentChatRealtimePublisher implements IAppointmentChatRealtimePublisher {
  constructor(private readonly eventBus: AppointmentChatRealtimeEventBus) {}

  async messageCreated(
    message: IAppointmentChatMessagePublicEntity,
    options?: { recipientUserId?: string | null },
  ): Promise<void> {
    await this.eventBus.publish({
      type: 'message.created',
      chatId: message.chatId,
      message,
      recipientUserId: options?.recipientUserId ?? null,
    });
  }

  async messageDeleted(payload: {
    chatId: string;
    messageId: string;
  }): Promise<void> {
    await this.eventBus.publish({
      type: 'message.deleted',
      chatId: payload.chatId,
      messageId: payload.messageId,
    });
  }

  async chatRead(payload: IAppointmentChatReadRealtimePayload): Promise<void> {
    await this.eventBus.publish({
      type: 'chat.read',
      chatId: payload.chatId,
      clientLastReadAt: payload.clientLastReadAt,
      masterLastReadAt: payload.masterLastReadAt,
    });
  }
}

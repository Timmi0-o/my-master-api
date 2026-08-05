import type { IAppointmentChatMessagePublicEntity } from '../../domain/entities/appointment-chat-message';

export interface IAppointmentChatReadRealtimePayload {
  chatId: string;
  clientLastReadAt: Date | null;
  masterLastReadAt: Date | null;
}

export interface IAppointmentChatRealtimePublisher {
  messageCreated(
    message: IAppointmentChatMessagePublicEntity,
    options?: { recipientUserId?: string | null },
  ): Promise<void>;
  messageUpdated(message: IAppointmentChatMessagePublicEntity): Promise<void>;
  messageDeleted(payload: {
    chatId: string;
    messageId: string;
    forUserId?: string;
  }): Promise<void>;
  chatRead(payload: IAppointmentChatReadRealtimePayload): Promise<void>;
}

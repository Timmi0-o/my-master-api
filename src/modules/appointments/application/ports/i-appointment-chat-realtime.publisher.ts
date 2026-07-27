import { IAppointmentChatMessagePublicEntity } from '../../domain/entities/appointment-chat-message';

export interface IAppointmentChatRealtimePublisher {
  messageCreated(
    message: IAppointmentChatMessagePublicEntity,
    options?: { recipientUserId?: string | null },
  ): Promise<void>;
  messageDeleted(payload: { chatId: string; messageId: string }): Promise<void>;
}

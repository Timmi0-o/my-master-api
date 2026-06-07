import { IAppointmentChatMessagePublicEntity } from '../../domain/entities/appointment-chat-message';

export interface IAppointmentChatRealtimePublisher {
  messageCreated(message: IAppointmentChatMessagePublicEntity): Promise<void>;
  messageDeleted(payload: { chatId: string; messageId: string }): Promise<void>;
}

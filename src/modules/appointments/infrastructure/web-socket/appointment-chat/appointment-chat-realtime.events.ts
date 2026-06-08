import type { IAppointmentChatMessagePublicEntity } from '../../../domain/entities/appointment-chat-message';

export const APPOINTMENT_CHAT_REALTIME_WS_EVENTS = {
  MESSAGE_CREATED: 'appointment-chat.message.created',
  MESSAGE_DELETED: 'appointment-chat.message.deleted',
} as const;

export type AppointmentChatRealtimeMessageCreatedEvent = {
  type: 'message.created';
  chatId: string;
  message: IAppointmentChatMessagePublicEntity;
};

export type AppointmentChatRealtimeMessageDeletedEvent = {
  type: 'message.deleted';
  chatId: string;
  messageId: string;
};

export type AppointmentChatRealtimeEvent =
  | AppointmentChatRealtimeMessageCreatedEvent
  | AppointmentChatRealtimeMessageDeletedEvent;

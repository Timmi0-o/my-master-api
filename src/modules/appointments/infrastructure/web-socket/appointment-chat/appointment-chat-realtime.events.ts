import type { IAppointmentChatMessagePublicEntity } from '../../../domain/entities/appointment-chat-message';

export const APPOINTMENT_CHAT_REALTIME_WS_EVENTS = {
  MESSAGE_CREATED: 'appointment-chat.message.created',
  MESSAGE_DELETED: 'appointment-chat.message.deleted',
} as const;

interface AppointmentChatRealtimeMessageEvent {
  chatId: string;
  message: IAppointmentChatMessagePublicEntity;
}

export interface AppointmentChatRealtimeMessageCreatedEvent extends AppointmentChatRealtimeMessageEvent {
  type: 'message.created';
}

export interface AppointmentChatRealtimeMessageDeletedEvent extends AppointmentChatRealtimeMessageEvent {
  type: 'message.deleted';
}

export type AppointmentChatRealtimeEvent =
  | AppointmentChatRealtimeMessageCreatedEvent
  | AppointmentChatRealtimeMessageDeletedEvent;

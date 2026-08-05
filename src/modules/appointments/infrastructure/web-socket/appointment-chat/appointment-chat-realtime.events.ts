import type { IAppointmentChatMessagePublicEntity } from '../../../domain/entities/appointment-chat-message';

export const APPOINTMENT_CHAT_REALTIME_WS_EVENTS = {
  MESSAGE_CREATED: 'appointment-chat.message.created',
  MESSAGE_UPDATED: 'appointment-chat.message.updated',
  MESSAGE_DELETED: 'appointment-chat.message.deleted',
  CHAT_READ: 'appointment-chat.read',
} as const;

interface AppointmentChatRealtimeMessageEvent {
  chatId: string;
  message?: IAppointmentChatMessagePublicEntity;
}

export interface AppointmentChatRealtimeMessageCreatedEvent extends AppointmentChatRealtimeMessageEvent {
  type: 'message.created';
  recipientUserId?: string | null;
}

export interface AppointmentChatRealtimeMessageUpdatedEvent extends AppointmentChatRealtimeMessageEvent {
  type: 'message.updated';
  message: IAppointmentChatMessagePublicEntity;
}

export interface AppointmentChatRealtimeMessageDeletedEvent extends AppointmentChatRealtimeMessageEvent {
  type: 'message.deleted';
  messageId: string;
  forUserId?: string;
}

export interface AppointmentChatRealtimeChatReadEvent {
  type: 'chat.read';
  chatId: string;
  clientLastReadAt: Date | null;
  masterLastReadAt: Date | null;
}

export type AppointmentChatRealtimeEvent =
  | AppointmentChatRealtimeMessageCreatedEvent
  | AppointmentChatRealtimeMessageUpdatedEvent
  | AppointmentChatRealtimeMessageDeletedEvent
  | AppointmentChatRealtimeChatReadEvent;

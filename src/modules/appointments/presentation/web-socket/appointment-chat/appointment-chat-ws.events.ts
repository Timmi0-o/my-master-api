export const APPOINTMENT_CHAT_WS_EVENTS = {
  JOIN: 'appointment-chat.join',
  LEAVE: 'appointment-chat.leave',
  MESSAGE_CREATED: 'appointment-chat.message.created',
  MESSAGE_DELETED: 'appointment-chat.message.deleted',
  /** In-app уведомление получателю (user room), даже если чат не открыт */
  INBOX_MESSAGE: 'appointment-chat.inbox.message',
  /** Клиент явно подписывается на inbox (user room) */
  SUBSCRIBE_INBOX: 'appointment-chat.inbox.subscribe',
} as const;

export const APPOINTMENT_CHAT_WS_ROOM_NAME = (chatId: string): string =>
  `chat:${chatId}`;

export const APPOINTMENT_CHAT_WS_USER_ROOM_NAME = (userId: string): string =>
  `user:${userId}`;

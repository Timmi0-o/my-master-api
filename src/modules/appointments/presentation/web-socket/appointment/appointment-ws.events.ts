export const APPOINTMENT_WS_EVENTS = {
  APPOINTMENT_CREATED: 'appointment.created',
  /** Клиент явно подписывается на inbox (user room) */
  SUBSCRIBE_INBOX: 'appointment.inbox.subscribe',
} as const;

export const APPOINTMENT_WS_USER_ROOM_NAME = (userId: string): string =>
  `user:${userId}`;

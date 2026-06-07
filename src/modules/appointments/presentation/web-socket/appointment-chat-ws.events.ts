export const APPOINTMENT_CHAT_WS_EVENTS = {
  JOIN: 'appointment-chat.join',
  LEAVE: 'appointment-chat.leave',
  MESSAGE_CREATED: 'appointment-chat.message.created',
  MESSAGE_DELETED: 'appointment-chat.message.deleted',
} as const;

export const buildAppointmentChatRoomName = (chatId: string): string =>
  `chat:${chatId}`;

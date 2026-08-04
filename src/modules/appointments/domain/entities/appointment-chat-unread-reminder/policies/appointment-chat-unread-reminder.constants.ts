/** Max unread-chat reminder notifications per recipient per UTC day. */
export const APPOINTMENT_CHAT_UNREAD_REMINDERS_MAX_PER_DAY = 3;

/** Hours without a read before an unread chat becomes eligible for a reminder. */
export const APPOINTMENT_CHAT_UNREAD_STALE_HOURS = 2;

export const APPOINTMENT_CHAT_UNREAD_STALE_MS =
  APPOINTMENT_CHAT_UNREAD_STALE_HOURS * 60 * 60 * 1000;

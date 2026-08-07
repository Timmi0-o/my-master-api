import { DomainError } from '@shared/domain/errors';

export class AppointmentChatMessageReplyTargetInvalidError extends DomainError {
  constructor(replyToMessageId: string, reason: string) {
    super(
      'APPOINTMENT_CHAT_MESSAGE_REPLY_TARGET_INVALID',
      'Appointment chat message reply target is invalid',
      { replyToMessageId, reason },
    );
  }
}

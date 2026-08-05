import { DomainError } from '@shared/domain/errors';

export class AppointmentChatMessageAttachmentInvalidError extends DomainError {
  constructor(message: string) {
    super(
      'APPOINTMENT_CHAT_MESSAGE_ATTACHMENT_INVALID',
      message,
    );
  }
}

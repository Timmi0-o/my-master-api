import { DomainError } from 'src/modules/shared/domain/errors';

export class AppointmentChatMessageForbiddenError extends DomainError {
  constructor(appointmentChatMessageId: string) {
    super('APPOINTMENT_CHAT_MESSAGE_FORBIDDEN', 'Access to appointment chat message is forbidden', {
      appointmentChatMessageId,
    });
  }
}

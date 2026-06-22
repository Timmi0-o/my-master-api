import { DomainError } from '@shared/domain/errors';

export class AppointmentChatMessageForbiddenError extends DomainError {
  constructor(appointmentChatMessageId: string) {
    super('APPOINTMENT_CHAT_MESSAGE_FORBIDDEN', 'Appointment chat message access forbidden', { appointmentChatMessageId });
  }
}

import { DomainError } from '@shared/domain/errors';

export class AppointmentChatMessageNotFoundError extends DomainError {
  constructor(appointmentChatMessageId: string) {
    super('APPOINTMENT_CHAT_MESSAGE_NOT_FOUND', 'Appointment chat message not found', { appointmentChatMessageId });
  }
}

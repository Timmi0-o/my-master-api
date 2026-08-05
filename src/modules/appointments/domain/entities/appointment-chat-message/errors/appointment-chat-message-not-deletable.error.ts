import { DomainError } from '@shared/domain/errors';

export class AppointmentChatMessageNotDeletableError extends DomainError {
  constructor(appointmentChatMessageId: string, reason: string) {
    super(
      'APPOINTMENT_CHAT_MESSAGE_NOT_DELETABLE',
      'Appointment chat message cannot be deleted',
      { appointmentChatMessageId, reason },
    );
  }
}

import { DomainError } from '@shared/domain/errors';

export class AppointmentChatMessageNotEditableError extends DomainError {
  constructor(appointmentChatMessageId: string, reason: string) {
    super(
      'APPOINTMENT_CHAT_MESSAGE_NOT_EDITABLE',
      'Appointment chat message cannot be edited',
      { appointmentChatMessageId, reason },
    );
  }
}

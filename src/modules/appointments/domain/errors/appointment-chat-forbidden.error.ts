import { DomainError } from 'src/modules/shared/domain/errors';

export class AppointmentChatForbiddenError extends DomainError {
  constructor(appointmentChatId: string) {
    super('APPOINTMENT_CHAT_FORBIDDEN', 'Access to appointment chat is forbidden', {
      appointmentChatId,
    });
  }
}

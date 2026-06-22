import { DomainError } from '@shared/domain/errors';

export class AppointmentChatForbiddenError extends DomainError {
  constructor(appointmentChatId: string) {
    super('APPOINTMENT_CHAT_FORBIDDEN', 'Appointment chat access forbidden', { appointmentChatId });
  }
}

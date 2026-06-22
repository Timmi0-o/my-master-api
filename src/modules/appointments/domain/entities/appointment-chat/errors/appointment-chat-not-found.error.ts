import { DomainError } from '@shared/domain/errors';

export class AppointmentChatNotFoundError extends DomainError {
  constructor(appointmentChatId: string) {
    super('APPOINTMENT_CHAT_NOT_FOUND', 'Appointment chat not found', { appointmentChatId });
  }
}

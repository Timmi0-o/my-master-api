import { AppointmentChatNotFoundError } from 'src/modules/appointments/domain/entities/appointment-chat';
import {
  isPrismaKnownError,
  normalizeUnknownPrismaError,
} from '@shared/infrastructure/persistence/repositories/shared';

export type AppointmentChatWriteErrorContext = {
  id?: string;
  appointmentId?: string;
};

export function mapAppointmentChatWriteError(
  error: unknown,
  context: AppointmentChatWriteErrorContext,
): Error {
  if (!isPrismaKnownError(error)) {
    return normalizeUnknownPrismaError(error);
  }

  if (error.code === 'P2025' && context.id !== undefined) {
    return new AppointmentChatNotFoundError(context.id);
  }

  return error;
}

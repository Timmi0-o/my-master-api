import { AppointmentChatMessageNotFoundError } from 'src/modules/appointments/domain/entities/appointment-chat-message';
import {
  isPrismaKnownError,
  normalizeUnknownPrismaError,
} from '@shared/infrastructure/persistence/repositories/shared';

export type AppointmentChatMessageWriteErrorContext = {
  id?: string;
  chatId?: string;
};

export function mapAppointmentChatMessageWriteError(
  error: unknown,
  context: AppointmentChatMessageWriteErrorContext,
): Error {
  if (!isPrismaKnownError(error)) {
    return normalizeUnknownPrismaError(error);
  }

  if (error.code === 'P2025' && context.id !== undefined) {
    return new AppointmentChatMessageNotFoundError(context.id);
  }

  return error;
}

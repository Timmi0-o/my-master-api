import { AppointmentNotFoundError } from 'src/modules/appointments/domain/entities/appointment';
import {
  isPrismaKnownError,
  normalizeUnknownPrismaError,
} from '@shared/infrastructure/persistence/repositories/shared';

export type AppointmentWriteErrorContext = {
  id?: string;
  masterProfileId?: string;
};

export function mapAppointmentWriteError(
  error: unknown,
  context: AppointmentWriteErrorContext,
): Error {
  if (!isPrismaKnownError(error)) {
    return normalizeUnknownPrismaError(error);
  }

  if (error.code === 'P2025' && context.id !== undefined) {
    return new AppointmentNotFoundError(context.id);
  }

  return error;
}

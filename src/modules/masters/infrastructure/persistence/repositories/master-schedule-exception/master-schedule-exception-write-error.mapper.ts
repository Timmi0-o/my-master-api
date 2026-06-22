import { MasterScheduleExceptionNotFoundError } from 'src/modules/masters/domain/entities/master-schedule-exception';
import {
  isPrismaKnownError,
  normalizeUnknownPrismaError,
} from '@shared/infrastructure/persistence/repositories/shared';

export type MasterScheduleExceptionWriteErrorContext = {
  id?: string;
  masterProfileId?: string;
};

export function mapMasterScheduleExceptionWriteError(
  error: unknown,
  context: MasterScheduleExceptionWriteErrorContext,
): Error {
  if (!isPrismaKnownError(error)) {
    return normalizeUnknownPrismaError(error);
  }

  if (error.code === 'P2025' && context.id !== undefined) {
    return new MasterScheduleExceptionNotFoundError(context.id);
  }

  return error;
}

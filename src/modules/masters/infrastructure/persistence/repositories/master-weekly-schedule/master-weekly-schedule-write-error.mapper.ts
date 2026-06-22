import { MasterWeeklyScheduleNotFoundError } from 'src/modules/masters/domain/entities/master-weekly-schedule';
import {
  isPrismaKnownError,
  normalizeUnknownPrismaError,
} from '@shared/infrastructure/persistence/repositories/shared';

export type MasterWeeklyScheduleWriteErrorContext = {
  id?: string;
  masterProfileId?: string;
};

export function mapMasterWeeklyScheduleWriteError(
  error: unknown,
  context: MasterWeeklyScheduleWriteErrorContext,
): Error {
  if (!isPrismaKnownError(error)) {
    return normalizeUnknownPrismaError(error);
  }

  if (error.code === 'P2025' && context.id !== undefined) {
    return new MasterWeeklyScheduleNotFoundError(context.id);
  }

  return error;
}

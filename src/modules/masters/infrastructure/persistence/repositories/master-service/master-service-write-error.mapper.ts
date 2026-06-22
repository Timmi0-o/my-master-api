import { MasterServiceNotFoundError } from 'src/modules/masters/domain/entities/master-service';
import {
  isPrismaKnownError,
  normalizeUnknownPrismaError,
} from '@shared/infrastructure/persistence/repositories/shared';

export type MasterServiceWriteErrorContext = {
  id?: string;
  masterProfileId?: string;
};

export function mapMasterServiceWriteError(
  error: unknown,
  context: MasterServiceWriteErrorContext,
): Error {
  if (!isPrismaKnownError(error)) {
    return normalizeUnknownPrismaError(error);
  }

  if (error.code === 'P2025' && context.id !== undefined) {
    return new MasterServiceNotFoundError(context.id);
  }

  return error;
}

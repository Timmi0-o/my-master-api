import { MasterProfileNotFoundError } from 'src/modules/masters/domain/entities/master-profile';
import {
  isPrismaKnownError,
  normalizeUnknownPrismaError,
} from '@shared/infrastructure/persistence/repositories/shared';

export type MasterProfileWriteErrorContext = {
  id?: string;
  userId?: string;
};

export function mapMasterProfileWriteError(
  error: unknown,
  context: MasterProfileWriteErrorContext,
): Error {
  if (!isPrismaKnownError(error)) {
    return normalizeUnknownPrismaError(error);
  }

  if (error.code === 'P2025' && context.id !== undefined) {
    return new MasterProfileNotFoundError(context.id);
  }

  return error;
}

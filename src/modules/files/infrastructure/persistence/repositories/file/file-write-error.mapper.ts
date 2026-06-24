import { FileNotFoundError } from 'src/modules/files/domain/entities/file';
import {
  isPrismaKnownError,
  normalizeUnknownPrismaError,
} from '@shared/infrastructure/persistence/repositories/shared';

export type FileWriteErrorContext = {
  id?: string;
  fileUrl?: string;
};

export function mapFileWriteError(
  error: unknown,
  context: FileWriteErrorContext,
): Error {
  if (!isPrismaKnownError(error)) {
    return normalizeUnknownPrismaError(error);
  }

  if (error.code === 'P2025' && context.id !== undefined) {
    return new FileNotFoundError(context.id);
  }

  return error;
}

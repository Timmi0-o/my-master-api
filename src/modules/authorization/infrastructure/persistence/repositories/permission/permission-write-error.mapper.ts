import { PermissionNotFoundError } from 'src/modules/authorization/domain/entities/permission';
import {
  isPrismaKnownError,
  normalizeUnknownPrismaError,
} from '@shared/infrastructure/persistence/repositories/shared';

export type PermissionWriteErrorContext = {
  id?: string;
};

export function mapPermissionWriteError(
  error: unknown,
  context: PermissionWriteErrorContext,
): Error {
  if (!isPrismaKnownError(error)) {
    return normalizeUnknownPrismaError(error);
  }

  if (error.code === 'P2025' && context.id !== undefined) {
    return new PermissionNotFoundError(context.id);
  }

  return error;
}

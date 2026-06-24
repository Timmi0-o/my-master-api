import { RoleNotFoundError } from 'src/modules/authorization/domain/entities/role';
import {
  isPrismaKnownError,
  normalizeUnknownPrismaError,
} from '@shared/infrastructure/persistence/repositories/shared';

export type RoleWriteErrorContext = {
  id?: string;
};

export function mapRoleWriteError(
  error: unknown,
  context: RoleWriteErrorContext,
): Error {
  if (!isPrismaKnownError(error)) {
    return normalizeUnknownPrismaError(error);
  }

  if (error.code === 'P2025' && context.id !== undefined) {
    return new RoleNotFoundError(context.id);
  }

  return error;
}

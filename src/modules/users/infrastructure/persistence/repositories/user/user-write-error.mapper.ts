import { UserNotFoundError } from 'src/modules/users/domain/entities/user';
import {
  isPrismaKnownError,
  normalizeUnknownPrismaError,
} from '@shared/infrastructure/persistence/repositories/shared';

export type UserWriteErrorContext = {
  id?: string;
  email?: string;
};

export function mapUserWriteError(
  error: unknown,
  context: UserWriteErrorContext,
): Error {
  if (!isPrismaKnownError(error)) {
    return normalizeUnknownPrismaError(error);
  }

  if (error.code === 'P2025' && context.id !== undefined) {
    return new UserNotFoundError(context.id);
  }

  return error;
}

import { UserProfileNotFoundError } from 'src/modules/users/domain/entities/user-profile';
import {
  isPrismaKnownError,
  normalizeUnknownPrismaError,
} from '@shared/infrastructure/persistence/repositories/shared';

export type UserProfileWriteErrorContext = {
  id?: string;
  userId?: string;
};

export function mapUserProfileWriteError(
  error: unknown,
  context: UserProfileWriteErrorContext,
): Error {
  if (!isPrismaKnownError(error)) {
    return normalizeUnknownPrismaError(error);
  }

  if (error.code === 'P2025' && context.id !== undefined) {
    return new UserProfileNotFoundError(context.id);
  }

  return error;
}

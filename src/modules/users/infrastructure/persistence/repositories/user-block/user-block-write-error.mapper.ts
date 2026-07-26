import {
  UserBlockAlreadyExistsError,
  UserBlockNotFoundError,
} from 'src/modules/users/domain/entities/user-block';
import {
  isPrismaKnownError,
  normalizeUnknownPrismaError,
} from '@shared/infrastructure/persistence/repositories/shared';

export type UserBlockWriteErrorContext = {
  id?: string;
  blockerUserId?: string;
  blockedUserId?: string;
};

export function mapUserBlockWriteError(
  error: unknown,
  context: UserBlockWriteErrorContext,
): Error {
  if (!isPrismaKnownError(error)) {
    return normalizeUnknownPrismaError(error);
  }

  if (error.code === 'P2025' && context.id !== undefined) {
    return new UserBlockNotFoundError(context.id);
  }

  if (
    error.code === 'P2002' &&
    context.blockerUserId !== undefined &&
    context.blockedUserId !== undefined
  ) {
    return new UserBlockAlreadyExistsError(
      context.blockerUserId,
      context.blockedUserId,
    );
  }

  return error;
}

import {
  UserPersonalNoteAlreadyExistsError,
  UserPersonalNoteNotFoundError,
} from 'src/modules/users/domain/entities/user-personal-note';
import {
  isPrismaKnownError,
  normalizeUnknownPrismaError,
} from '@shared/infrastructure/persistence/repositories/shared';

export type UserPersonalNoteWriteErrorContext = {
  id?: string;
  ownerUserId?: string;
  referenceUserId?: string;
};

export function mapUserPersonalNoteWriteError(
  error: unknown,
  context: UserPersonalNoteWriteErrorContext,
): Error {
  if (!isPrismaKnownError(error)) {
    return normalizeUnknownPrismaError(error);
  }

  if (error.code === 'P2025' && context.id !== undefined) {
    return new UserPersonalNoteNotFoundError({ id: context.id });
  }

  if (
    error.code === 'P2002' &&
    context.ownerUserId !== undefined &&
    context.referenceUserId !== undefined
  ) {
    return new UserPersonalNoteAlreadyExistsError(
      context.ownerUserId,
      context.referenceUserId,
    );
  }

  return error;
}

import {
  NotificationAlreadyExistsError,
  NotificationNotFoundError,
} from 'src/modules/notifications/domain/entities/notification';
import {
  isPrismaKnownError,
  normalizeUnknownPrismaError,
} from '@shared/infrastructure/persistence/repositories/shared';

export type NotificationWriteErrorContext = {
  id?: string;
  userId?: string;
  idempotencyKey?: string | null;
};

export function mapNotificationWriteError(
  error: unknown,
  context: NotificationWriteErrorContext,
): Error {
  if (!isPrismaKnownError(error)) {
    return normalizeUnknownPrismaError(error);
  }

  if (error.code === 'P2025' && context.id !== undefined) {
    return new NotificationNotFoundError(context.id);
  }

  if (
    error.code === 'P2002' &&
    context.userId !== undefined &&
    context.idempotencyKey
  ) {
    return new NotificationAlreadyExistsError(
      context.userId,
      context.idempotencyKey,
    );
  }

  return error;
}

import {
  MasterServiceReviewReactionAlreadyExistsError,
  MasterServiceReviewReactionNotFoundError,
} from 'src/modules/masters/domain/entities/master-service-review-reaction';
import {
  isPrismaKnownError,
  normalizeUnknownPrismaError,
} from '@shared/infrastructure/persistence/repositories/shared';

export type MasterServiceReviewReactionWriteErrorContext = {
  id?: string;
  userId?: string;
  masterServiceReviewId?: string;
};

export function mapMasterServiceReviewReactionWriteError(
  error: unknown,
  context: MasterServiceReviewReactionWriteErrorContext,
): Error {
  if (!isPrismaKnownError(error)) {
    return normalizeUnknownPrismaError(error);
  }

  if (error.code === 'P2025' && context.id !== undefined) {
    return new MasterServiceReviewReactionNotFoundError(context.id);
  }

  if (
    error.code === 'P2002' &&
    context.userId !== undefined &&
    context.masterServiceReviewId !== undefined
  ) {
    return new MasterServiceReviewReactionAlreadyExistsError(
      context.userId,
      context.masterServiceReviewId,
    );
  }

  return error;
}

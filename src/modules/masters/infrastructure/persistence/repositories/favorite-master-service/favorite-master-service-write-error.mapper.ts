import {
  FavoriteMasterServiceAlreadyExistsError,
  FavoriteMasterServiceNotFoundError,
} from 'src/modules/masters/domain/entities/favorite-master-service';
import {
  isPrismaKnownError,
  normalizeUnknownPrismaError,
} from '@shared/infrastructure/persistence/repositories/shared';

export type FavoriteMasterServiceWriteErrorContext = {
  id?: string;
  userId?: string;
  masterServiceId?: string;
};

export function mapFavoriteMasterServiceWriteError(
  error: unknown,
  context: FavoriteMasterServiceWriteErrorContext,
): Error {
  if (!isPrismaKnownError(error)) {
    return normalizeUnknownPrismaError(error);
  }

  if (error.code === 'P2025' && context.id !== undefined) {
    return new FavoriteMasterServiceNotFoundError(context.id);
  }

  if (
    error.code === 'P2002' &&
    context.userId !== undefined &&
    context.masterServiceId !== undefined
  ) {
    return new FavoriteMasterServiceAlreadyExistsError(
      context.userId,
      context.masterServiceId,
    );
  }

  return error;
}

import {
  MasterSubscriptionAlreadyExistsError,
  MasterSubscriptionNotFoundError,
} from 'src/modules/masters/domain/entities/master-subscription';
import {
  isPrismaKnownError,
  normalizeUnknownPrismaError,
} from '@shared/infrastructure/persistence/repositories/shared';

export type MasterSubscriptionWriteErrorContext = {
  id?: string;
  userId?: string;
  masterProfileId?: string;
};

export function mapMasterSubscriptionWriteError(
  error: unknown,
  context: MasterSubscriptionWriteErrorContext,
): Error {
  if (!isPrismaKnownError(error)) {
    return normalizeUnknownPrismaError(error);
  }

  if (error.code === 'P2025' && context.id !== undefined) {
    return new MasterSubscriptionNotFoundError(context.id);
  }

  if (
    error.code === 'P2002' &&
    context.userId !== undefined &&
    context.masterProfileId !== undefined
  ) {
    return new MasterSubscriptionAlreadyExistsError(
      context.userId,
      context.masterProfileId,
    );
  }

  return error;
}

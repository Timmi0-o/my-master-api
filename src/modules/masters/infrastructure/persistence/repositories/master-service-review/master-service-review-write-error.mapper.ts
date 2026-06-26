import {
  MasterServiceReviewAlreadyExistsError,
  MasterServiceReviewNotFoundError,
} from 'src/modules/masters/domain/entities/master-service-review';
import {
  isPrismaKnownError,
  normalizeUnknownPrismaError,
} from '@shared/infrastructure/persistence/repositories/shared';

export type MasterServiceReviewWriteErrorContext = {
  id?: string;
  appointmentId?: string;
};

export function mapMasterServiceReviewWriteError(
  error: unknown,
  context: MasterServiceReviewWriteErrorContext,
): Error {
  if (!isPrismaKnownError(error)) {
    return normalizeUnknownPrismaError(error);
  }

  if (error.code === 'P2025' && context.id !== undefined) {
    return new MasterServiceReviewNotFoundError(context.id);
  }

  if (error.code === 'P2002' && context.appointmentId !== undefined) {
    return new MasterServiceReviewAlreadyExistsError(context.appointmentId);
  }

  return error;
}

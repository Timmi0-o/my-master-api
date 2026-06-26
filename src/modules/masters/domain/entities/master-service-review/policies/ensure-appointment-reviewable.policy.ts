import type { IAppointmentEntity } from 'src/modules/appointments/domain/entities/appointment';
import { EAppointmentStatus } from 'src/modules/appointments/domain/entities/appointment';
import {
  MasterServiceReviewAlreadyExistsError,
  MasterServiceReviewAppointmentNotCompletedError,
  MasterServiceReviewForbiddenError,
  MasterServiceReviewInvalidRatingError,
} from '../errors';
import type { IMasterServiceReviewActor } from './master-service-review-actor.types';
import type { IMasterServiceReviewEntity } from '../i-master-service-review.entity';

export function ensureAppointmentReviewable(
  appointment: IAppointmentEntity,
  actor: IMasterServiceReviewActor,
  existingReview: IMasterServiceReviewEntity | null | undefined,
): void {
  if (appointment.status !== EAppointmentStatus.COMPLETED) {
    throw new MasterServiceReviewAppointmentNotCompletedError(appointment.id);
  }

  if (appointment.clientUserId !== actor.userId) {
    throw new MasterServiceReviewForbiddenError(appointment.id);
  }

  if (existingReview) {
    throw new MasterServiceReviewAlreadyExistsError(appointment.id);
  }
}

export const MASTER_SERVICE_REVIEW_MIN_RATING = 1;
export const MASTER_SERVICE_REVIEW_MAX_RATING = 5;

export function ensureValidReviewRating(rating: number): void {
  if (
    rating < MASTER_SERVICE_REVIEW_MIN_RATING ||
    rating > MASTER_SERVICE_REVIEW_MAX_RATING ||
    !Number.isInteger(rating)
  ) {
    throw new MasterServiceReviewInvalidRatingError(rating);
  }
}

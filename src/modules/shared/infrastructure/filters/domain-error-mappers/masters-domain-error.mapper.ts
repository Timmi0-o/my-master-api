import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import type { DomainErrorMapper } from './domain-error-mapper.types';
import {
  MasterProfileForbiddenError,
  MasterProfileNotFoundError,
  MasterEmailNotVerifiedError,
  MasterProfileOnboardingIncompleteError,
} from 'src/modules/masters/domain/entities/master-profile';
import {
  MasterServiceBlockedError,
  MasterServiceForbiddenError,
  MasterServiceInvalidStatusTransitionError,
  MasterServiceInvalidTagsError,
  MasterServiceNotBookableError,
  MasterServiceNotFoundError,
} from 'src/modules/masters/domain/entities/master-service';
import {
  ImageMaxCountError,
  ImageNotFoundError,
  UnsupportedImageEntityTypeError,
} from 'src/modules/masters/domain/entities/image';
import {
  MasterWeeklyScheduleForbiddenError,
  MasterWeeklyScheduleNotFoundError,
} from 'src/modules/masters/domain/entities/master-weekly-schedule';
import {
  MasterScheduleExceptionForbiddenError,
  MasterScheduleExceptionNotFoundError,
} from 'src/modules/masters/domain/entities/master-schedule-exception';
import {
  MasterServiceReviewAlreadyExistsError,
  MasterServiceReviewAppointmentNotCompletedError,
  MasterServiceReviewBlockedError,
  MasterServiceReviewForbiddenError,
  MasterServiceReviewInvalidRatingError,
  MasterServiceReviewNotFoundError,
} from 'src/modules/masters/domain/entities/master-service-review';
import {
  MasterSubscriptionAlreadyExistsError,
  MasterSubscriptionBlockedUserError,
  MasterSubscriptionCannotSubscribeToSelfError,
  MasterSubscriptionForbiddenError,
  MasterSubscriptionNotFoundError,
} from 'src/modules/masters/domain/entities/master-subscription';
import {
  FavoriteMasterServiceAlreadyExistsError,
  FavoriteMasterServiceForbiddenError,
  FavoriteMasterServiceNotFoundError,
} from 'src/modules/masters/domain/entities/favorite-master-service';
import {
  MasterServiceReviewReactionAlreadyExistsError,
  MasterServiceReviewReactionForbiddenError,
  MasterServiceReviewReactionNotFoundError,
} from 'src/modules/masters/domain/entities/master-service-review-reaction';

export const mapMastersDomainError: DomainErrorMapper = (error) => {
  if (
    error instanceof MasterProfileNotFoundError ||
    error instanceof MasterServiceNotFoundError ||
    error instanceof MasterWeeklyScheduleNotFoundError ||
    error instanceof MasterScheduleExceptionNotFoundError ||
    error instanceof ImageNotFoundError ||
    error instanceof MasterServiceReviewNotFoundError ||
    error instanceof MasterServiceReviewReactionNotFoundError ||
    error instanceof MasterSubscriptionNotFoundError ||
    error instanceof FavoriteMasterServiceNotFoundError
  ) {
    return new NotFoundException(error.message);
  }
  if (
    error instanceof ImageMaxCountError ||
    error instanceof UnsupportedImageEntityTypeError ||
    error instanceof MasterServiceInvalidTagsError ||
    error instanceof MasterServiceNotBookableError ||
    error instanceof MasterServiceInvalidStatusTransitionError ||
    error instanceof MasterServiceReviewAlreadyExistsError ||
    error instanceof MasterServiceReviewAppointmentNotCompletedError ||
    error instanceof MasterServiceReviewInvalidRatingError ||
    error instanceof MasterServiceReviewReactionAlreadyExistsError ||
    error instanceof MasterSubscriptionAlreadyExistsError ||
    error instanceof FavoriteMasterServiceAlreadyExistsError ||
    error instanceof MasterProfileOnboardingIncompleteError
  ) {
    return new BadRequestException(error.message);
  }
  if (
    error instanceof MasterProfileForbiddenError ||
    error instanceof MasterServiceForbiddenError ||
    error instanceof MasterServiceBlockedError ||
    error instanceof MasterWeeklyScheduleForbiddenError ||
    error instanceof MasterScheduleExceptionForbiddenError ||
    error instanceof MasterServiceReviewForbiddenError ||
    error instanceof MasterServiceReviewBlockedError ||
    error instanceof MasterServiceReviewReactionForbiddenError ||
    error instanceof MasterSubscriptionForbiddenError ||
    error instanceof MasterSubscriptionCannotSubscribeToSelfError ||
    error instanceof MasterSubscriptionBlockedUserError ||
    error instanceof FavoriteMasterServiceForbiddenError ||
    error instanceof MasterEmailNotVerifiedError
  ) {
    return new ForbiddenException(error.message);
  }
  return null;
};

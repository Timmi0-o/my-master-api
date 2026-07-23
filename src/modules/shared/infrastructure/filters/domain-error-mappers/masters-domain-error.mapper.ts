import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import type { DomainErrorMapper } from './domain-error-mapper.types';
import {
  MasterProfileForbiddenError,
  MasterProfileNotFoundError,
} from 'src/modules/masters/domain/entities/master-profile';
import {
  MasterServiceForbiddenError,
  MasterServiceNotFoundError,
} from 'src/modules/masters/domain/entities/master-service';
import {
  MasterServiceImageNotFoundError,
  MasterServiceMaxImagesCountError,
} from 'src/modules/masters/domain/entities/master-service-image';
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
  MasterServiceReviewForbiddenError,
  MasterServiceReviewInvalidRatingError,
  MasterServiceReviewNotFoundError,
} from 'src/modules/masters/domain/entities/master-service-review';
import {
  MasterSubscriptionAlreadyExistsError,
  MasterSubscriptionCannotSubscribeToSelfError,
  MasterSubscriptionForbiddenError,
  MasterSubscriptionNotFoundError,
} from 'src/modules/masters/domain/entities/master-subscription';
import {
  FavoriteMasterServiceAlreadyExistsError,
  FavoriteMasterServiceForbiddenError,
  FavoriteMasterServiceNotFoundError,
} from 'src/modules/masters/domain/entities/favorite-master-service';

export const mapMastersDomainError: DomainErrorMapper = (error) => {
  if (
    error instanceof MasterProfileNotFoundError ||
    error instanceof MasterServiceNotFoundError ||
    error instanceof MasterWeeklyScheduleNotFoundError ||
    error instanceof MasterScheduleExceptionNotFoundError ||
    error instanceof MasterServiceImageNotFoundError ||
    error instanceof MasterServiceReviewNotFoundError ||
    error instanceof MasterSubscriptionNotFoundError ||
    error instanceof FavoriteMasterServiceNotFoundError
  ) {
    return new NotFoundException(error.message);
  }
  if (
    error instanceof MasterServiceMaxImagesCountError ||
    error instanceof MasterServiceReviewAlreadyExistsError ||
    error instanceof MasterServiceReviewAppointmentNotCompletedError ||
    error instanceof MasterServiceReviewInvalidRatingError ||
    error instanceof MasterSubscriptionAlreadyExistsError ||
    error instanceof FavoriteMasterServiceAlreadyExistsError
  ) {
    return new BadRequestException(error.message);
  }
  if (
    error instanceof MasterProfileForbiddenError ||
    error instanceof MasterServiceForbiddenError ||
    error instanceof MasterWeeklyScheduleForbiddenError ||
    error instanceof MasterScheduleExceptionForbiddenError ||
    error instanceof MasterServiceReviewForbiddenError ||
    error instanceof MasterSubscriptionForbiddenError ||
    error instanceof MasterSubscriptionCannotSubscribeToSelfError ||
    error instanceof FavoriteMasterServiceForbiddenError
  ) {
    return new ForbiddenException(error.message);
  }
  return null;
};

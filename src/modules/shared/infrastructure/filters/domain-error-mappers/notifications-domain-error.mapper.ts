import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import {
  NotificationAlreadyExistsError,
  NotificationForbiddenError,
  NotificationNotFoundError,
} from 'src/modules/notifications/domain/entities/notification';
import type { DomainErrorMapper } from './domain-error-mapper.types';

export const mapNotificationsDomainError: DomainErrorMapper = (error) => {
  if (error instanceof NotificationNotFoundError) {
    return new NotFoundException(error.message);
  }

  if (error instanceof NotificationForbiddenError) {
    return new ForbiddenException(error.message);
  }

  if (error instanceof NotificationAlreadyExistsError) {
    return new ConflictException(error.message);
  }

  return null;
};

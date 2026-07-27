import {
  ForbiddenException,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import {
  VapidConfigMissingError,
  WebPushSubscriptionForbiddenError,
  WebPushSubscriptionNotFoundError,
} from 'src/modules/web-push-subscriptions/domain/entities/web-push-subscription';
import type { DomainErrorMapper } from './domain-error-mapper.types';

export const mapWebPushSubscriptionsDomainError: DomainErrorMapper = (
  error,
) => {
  if (error instanceof WebPushSubscriptionNotFoundError) {
    return new NotFoundException(error.message);
  }

  if (error instanceof WebPushSubscriptionForbiddenError) {
    return new ForbiddenException(error.message);
  }

  if (error instanceof VapidConfigMissingError) {
    return new ServiceUnavailableException(error.message);
  }

  return null;
};

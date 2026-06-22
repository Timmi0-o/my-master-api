import {
  NotFoundException,
  ForbiddenException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import type { DomainErrorMapper } from './domain-error-mapper.types';
import { UserNotFoundError, UserAlreadyExistsError, UserNotActiveError } from 'src/modules/users/domain/entities/user';
import { UserProfileNotFoundError } from 'src/modules/users/domain/entities/user-profile';
import { UserProfileForbiddenError } from 'src/modules/users/domain/entities/user-profile';

export const mapUsersDomainError: DomainErrorMapper = (error) => {
  if (error instanceof UserNotFoundError) {
    return new NotFoundException(error.message);
  }
  if (error instanceof UserProfileNotFoundError) {
    return new NotFoundException(error.message);
  }
  if (error instanceof UserNotActiveError) {
    return new ForbiddenException(error.message);
  }
  if (error instanceof UserProfileForbiddenError) {
    return new ForbiddenException(error.message);
  }
  if (error instanceof UserAlreadyExistsError) {
    return new ConflictException(error.message);
  }
  return null;
};

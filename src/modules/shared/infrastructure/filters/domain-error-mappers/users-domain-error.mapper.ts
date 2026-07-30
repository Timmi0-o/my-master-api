import {
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import type { DomainErrorMapper } from './domain-error-mapper.types';
import { UserNotFoundError, UserAlreadyExistsError, UserNotActiveError } from 'src/modules/users/domain/entities/user';
import { UserProfileNotFoundError } from 'src/modules/users/domain/entities/user-profile';
import { UserProfileForbiddenError } from 'src/modules/users/domain/entities/user-profile';
import {
  UserBlockAlreadyExistsError,
  UserBlockCannotBlockSelfError,
  UserBlockForbiddenError,
  UserBlockInteractionForbiddenError,
  UserBlockNotFoundError,
} from 'src/modules/users/domain/entities/user-block';
import {
  UserPersonalNoteAlreadyExistsError,
  UserPersonalNoteCannotTargetSelfError,
  UserPersonalNoteForbiddenError,
  UserPersonalNoteNotFoundError,
} from 'src/modules/users/domain/entities/user-personal-note';

export const mapUsersDomainError: DomainErrorMapper = (error) => {
  if (
    error instanceof UserNotFoundError ||
    error instanceof UserProfileNotFoundError ||
    error instanceof UserBlockNotFoundError ||
    error instanceof UserPersonalNoteNotFoundError
  ) {
    return new NotFoundException(error.message);
  }
  if (error instanceof UserNotActiveError) {
    return new ForbiddenException(error.message);
  }
  if (
    error instanceof UserProfileForbiddenError ||
    error instanceof UserBlockForbiddenError ||
    error instanceof UserBlockCannotBlockSelfError ||
    error instanceof UserBlockInteractionForbiddenError ||
    error instanceof UserPersonalNoteForbiddenError ||
    error instanceof UserPersonalNoteCannotTargetSelfError
  ) {
    return new ForbiddenException(error.message);
  }
  if (error instanceof UserAlreadyExistsError) {
    return new ConflictException(error.message);
  }
  if (
    error instanceof UserBlockAlreadyExistsError ||
    error instanceof UserPersonalNoteAlreadyExistsError
  ) {
    return new BadRequestException(error.message);
  }
  return null;
};

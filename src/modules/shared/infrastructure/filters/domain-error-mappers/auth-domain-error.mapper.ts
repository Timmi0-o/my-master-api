import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import type { DomainErrorMapper } from './domain-error-mapper.types';
import {
  InvalidCurrentPasswordError,
  InvalidResetPasswordTokenError,
} from 'src/modules/auth/domain/entities/password-reset-token';
import { RefreshTokenInvalidError } from 'src/modules/auth/domain/entities/refresh-token';

export const mapAuthDomainError: DomainErrorMapper = (error) => {
  if (error instanceof RefreshTokenInvalidError) {
    return new UnauthorizedException(error.message);
  }
  if (error instanceof InvalidResetPasswordTokenError) {
    return new BadRequestException(error.message);
  }
  if (error instanceof InvalidCurrentPasswordError) {
    return new BadRequestException(error.message);
  }
  return null;
};

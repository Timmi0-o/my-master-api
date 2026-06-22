import { UnauthorizedException } from '@nestjs/common';
import type { DomainErrorMapper } from './domain-error-mapper.types';
import { RefreshTokenInvalidError } from 'src/modules/auth/domain/entities/refresh-token';

export const mapAuthDomainError: DomainErrorMapper = (error) => {
  if (error instanceof RefreshTokenInvalidError) {
    return new UnauthorizedException(error.message);
  }
  return null;
};

import { DomainError } from '@shared/domain/errors';

export class RefreshTokenInvalidError extends DomainError {
  constructor() {
    super('REFRESH_TOKEN_INVALID', 'Refresh token is invalid or expired');
  }
}

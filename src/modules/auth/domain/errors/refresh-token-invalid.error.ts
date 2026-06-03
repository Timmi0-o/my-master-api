import { DomainError } from 'src/modules/shared/domain/errors';

export class RefreshTokenInvalidError extends DomainError {
  constructor() {
    super('REFRESH_TOKEN_INVALID', 'Refresh token is invalid');
  }
}

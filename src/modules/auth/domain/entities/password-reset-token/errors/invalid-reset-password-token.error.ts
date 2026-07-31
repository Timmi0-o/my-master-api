import { DomainError } from '@shared/domain/errors';

export class InvalidResetPasswordTokenError extends DomainError {
  constructor() {
    super(
      'INVALID_RESET_PASSWORD_TOKEN',
      'Reset password token is invalid or expired',
    );
  }
}

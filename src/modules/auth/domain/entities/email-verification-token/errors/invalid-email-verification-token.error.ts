import { DomainError } from '@shared/domain/errors';

export class InvalidEmailVerificationTokenError extends DomainError {
  constructor() {
    super(
      'INVALID_EMAIL_VERIFICATION_TOKEN',
      'Email verification token is invalid or expired',
    );
  }
}

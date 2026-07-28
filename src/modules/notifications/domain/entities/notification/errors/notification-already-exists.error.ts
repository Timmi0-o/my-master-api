import { DomainError } from '@shared/domain/errors';

export class NotificationAlreadyExistsError extends DomainError {
  constructor(userId: string, idempotencyKey: string) {
    super('NOTIFICATION_ALREADY_EXISTS', 'Notification already exists', {
      userId,
      idempotencyKey,
    });
  }
}

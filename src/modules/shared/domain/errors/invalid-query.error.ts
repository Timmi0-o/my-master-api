import { DomainError } from './domain.error';

export class InvalidQueryError extends DomainError {
  constructor(message: string, context?: Record<string, unknown>) {
    super('INVALID_QUERY', message, context);
  }
}

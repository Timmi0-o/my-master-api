import { DomainError } from '@shared/domain/errors';

export class LocalityNotFoundError extends DomainError {
  constructor(localityId: string) {
    super('LOCALITY_NOT_FOUND', 'Locality not found', { localityId });
  }
}

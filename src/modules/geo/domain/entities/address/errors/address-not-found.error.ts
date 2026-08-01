import { DomainError } from '@shared/domain/errors';

export class AddressNotFoundError extends DomainError {
  constructor(entityId: string) {
    super('ADDRESS_NOT_FOUND', 'Address not found', { entityId });
  }
}

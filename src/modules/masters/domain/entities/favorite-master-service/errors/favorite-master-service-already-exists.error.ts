import { DomainError } from '@shared/domain/errors';

export class FavoriteMasterServiceAlreadyExistsError extends DomainError {
  constructor(userId: string, masterServiceId: string) {
    super(
      'FAVORITE_MASTER_SERVICE_ALREADY_EXISTS',
      'Favorite for this master service already exists',
      { userId, masterServiceId },
    );
  }
}

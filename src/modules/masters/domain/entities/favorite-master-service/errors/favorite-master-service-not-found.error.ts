import { DomainError } from '@shared/domain/errors';

export class FavoriteMasterServiceNotFoundError extends DomainError {
  constructor(favoriteMasterServiceId: string) {
    super(
      'FAVORITE_MASTER_SERVICE_NOT_FOUND',
      'Favorite master service not found',
      { favoriteMasterServiceId },
    );
  }
}

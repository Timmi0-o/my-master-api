import { DomainError } from '@shared/domain/errors';

export class FavoriteMasterServiceForbiddenError extends DomainError {
  constructor(favoriteMasterServiceId?: string) {
    super(
      'FAVORITE_MASTER_SERVICE_FORBIDDEN',
      'Favorite master service access forbidden',
      favoriteMasterServiceId ? { favoriteMasterServiceId } : {},
    );
  }
}

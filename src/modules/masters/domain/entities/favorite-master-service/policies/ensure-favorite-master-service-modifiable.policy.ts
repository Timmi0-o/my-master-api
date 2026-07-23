import type { IFavoriteMasterServiceEntity } from '../i-favorite-master-service.entity';
import { FavoriteMasterServiceForbiddenError } from '../errors';
import type { IFavoriteMasterServiceActor } from './favorite-master-service-actor.types';

export function ensureFavoriteMasterServiceModifiable(
  favorite: IFavoriteMasterServiceEntity,
  actor: IFavoriteMasterServiceActor,
): void {
  if (actor.isStaffUser) {
    return;
  }

  if (favorite.userId === actor.userId) {
    return;
  }

  throw new FavoriteMasterServiceForbiddenError(favorite.id);
}

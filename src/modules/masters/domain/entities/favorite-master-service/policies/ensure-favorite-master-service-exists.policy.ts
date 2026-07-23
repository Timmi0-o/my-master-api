import type { IFavoriteMasterServiceEntity } from '../i-favorite-master-service.entity';
import { FavoriteMasterServiceNotFoundError } from '../errors';

export function ensureFavoriteMasterServiceExists(
  entity: IFavoriteMasterServiceEntity | null | undefined,
  id: string,
): asserts entity is IFavoriteMasterServiceEntity {
  if (!entity) {
    throw new FavoriteMasterServiceNotFoundError(id);
  }
}

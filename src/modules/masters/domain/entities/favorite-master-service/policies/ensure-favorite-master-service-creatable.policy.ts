import type { IFavoriteMasterServiceEntity } from '../i-favorite-master-service.entity';
import { FavoriteMasterServiceAlreadyExistsError } from '../errors';

export function ensureFavoriteMasterServiceCreatable(
  existing: IFavoriteMasterServiceEntity | null | undefined,
  userId: string,
  masterServiceId: string,
): void {
  if (existing && existing.deletedAt == null) {
    throw new FavoriteMasterServiceAlreadyExistsError(userId, masterServiceId);
  }
}

import type { IDeleteFavoriteMasterServiceApplicationInput } from 'src/modules/masters/application/dtos/favorite-master-service/delete-favorite-master-service.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import { toMasterActor } from '../shared/to-master-actor';

export function payloadToDeleteFavoriteMasterServiceInput(
  id: string,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IDeleteFavoriteMasterServiceApplicationInput {
  return {
    id,
    actor: toMasterActor(sessionUser, isStaffUser),
  };
}

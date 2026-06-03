import type { IDeleteMasterServiceApplicationInput } from 'src/modules/masters/application/dtos/master-service/delete-master-service.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import { toMasterActor } from '../shared/to-master-actor';

export function payloadToDeleteMasterServiceInput(
  id: string,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IDeleteMasterServiceApplicationInput {
  return {
    id,
    actor: toMasterActor(sessionUser, isStaffUser),
  };
}

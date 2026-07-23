import type { ICreateFavoriteMasterServiceApplicationInput } from 'src/modules/masters/application/dtos/favorite-master-service/create-favorite-master-service.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { ICreateFavoriteMasterServicePayload } from '../../validation/schemas/create-favorite-master-service-payload.types';
import { toMasterActor } from '../shared/to-master-actor';

export function payloadToCreateFavoriteMasterServiceInput(
  payload: ICreateFavoriteMasterServicePayload,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): ICreateFavoriteMasterServiceApplicationInput {
  return {
    masterServiceId: payload.masterServiceId,
    actor: toMasterActor(sessionUser, isStaffUser),
  };
}

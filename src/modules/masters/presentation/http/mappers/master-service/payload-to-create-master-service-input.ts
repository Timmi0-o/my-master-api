import type { ICreateMasterServiceApplicationInput } from 'src/modules/masters/application/dtos/master-service/create-master-service.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { ICreateMasterServicePayload } from '../../validation/schemas/create-master-service-payload.types';
import { toMasterActor } from '../shared/to-master-actor';

export function payloadToCreateMasterServiceInput(
  payload: ICreateMasterServicePayload,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): ICreateMasterServiceApplicationInput {
  return {
    masterProfileId: payload.masterProfileId,
    name: payload.name,
    description: payload.description,
    price: payload.price,
    durationMinutes: payload.durationMinutes,
    category: payload.category,
    actor: toMasterActor(sessionUser, isStaffUser),
  };
}

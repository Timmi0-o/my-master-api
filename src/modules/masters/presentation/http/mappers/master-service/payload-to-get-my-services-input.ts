import type { IGetMyServicesApplicationInput } from 'src/modules/masters/application/dtos/master-service/get-my-services.input';
import type {
  IMasterServicePublicEntity,
  IMasterServiceRelations,
} from 'src/modules/masters/domain/entities/master-service';
import type { FindManyParams } from 'src/modules/shared/domain/query';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import { toMasterActor } from '../shared/to-master-actor';

export function payloadToGetMyServicesInput(
  params: FindManyParams<IMasterServicePublicEntity, IMasterServiceRelations>,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IGetMyServicesApplicationInput {
  return {
    actor: toMasterActor(sessionUser, isStaffUser),
    params,
  };
}

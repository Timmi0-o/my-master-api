import type { IDeleteMasterServiceImagesApplicationInput } from 'src/modules/masters/application/dtos/master-service/delete-master-service-images.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { IDeleteMasterServiceImagesPayload } from '../../validation/schemas/delete-master-service-images-payload.types';
import { toMasterActor } from '../shared/to-master-actor';

export function payloadToDeleteMasterServiceImagesInput(
  masterServiceId: string,
  payload: IDeleteMasterServiceImagesPayload,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IDeleteMasterServiceImagesApplicationInput {
  return {
    masterServiceId,
    fileIds: payload.fileIds,
    actor: toMasterActor(sessionUser, isStaffUser),
  };
}

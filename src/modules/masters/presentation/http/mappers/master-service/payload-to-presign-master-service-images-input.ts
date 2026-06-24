import type { IPresignMasterServiceImagesApplicationInput } from 'src/modules/masters/application/dtos/master-service/presign-master-service-images.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { IPresignMasterServiceImagesPayload } from '../../validation/schemas/presign-master-service-images-payload.types';
import { toMasterActor } from '../shared/to-master-actor';

export function payloadToPresignMasterServiceImagesInput(
  masterServiceId: string,
  payload: IPresignMasterServiceImagesPayload,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IPresignMasterServiceImagesApplicationInput {
  return {
    masterServiceId,
    files: payload.files,
    actor: toMasterActor(sessionUser, isStaffUser),
  };
}

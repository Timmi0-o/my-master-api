import { ImageEntityType } from 'src/modules/masters/domain/entities/image';
import type { IPresignImagesApplicationInput } from 'src/modules/masters/application/dtos/image/presign-images.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { IPresignMasterServiceImagesPayload } from '../../validation/schemas/presign-master-service-images-payload.types';
import { toMasterActor } from '../shared/to-master-actor';

export function payloadToPresignMasterServiceImagesInput(
  masterServiceId: string,
  payload: IPresignMasterServiceImagesPayload,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IPresignImagesApplicationInput {
  return {
    entityType: ImageEntityType.MASTER_SERVICE,
    entityId: masterServiceId,
    files: payload.files,
    actor: toMasterActor(sessionUser, isStaffUser),
  };
}

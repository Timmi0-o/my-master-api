import { ImageEntityType } from 'src/modules/masters/domain/entities/image';
import type { IDeleteImagesApplicationInput } from 'src/modules/masters/application/dtos/image/delete-images.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { IDeleteMasterServiceImagesPayload } from '../../validation/schemas/delete-master-service-images-payload.types';
import { toMasterActor } from '../shared/to-master-actor';

export function payloadToDeleteMasterServiceImagesInput(
  masterServiceId: string,
  payload: IDeleteMasterServiceImagesPayload,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IDeleteImagesApplicationInput {
  return {
    entityType: ImageEntityType.MASTER_SERVICE,
    entityId: masterServiceId,
    fileIds: payload.fileIds,
    actor: toMasterActor(sessionUser, isStaffUser),
  };
}

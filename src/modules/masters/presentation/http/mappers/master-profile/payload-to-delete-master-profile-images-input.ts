import { ImageEntityType } from 'src/modules/masters/domain/entities/image';
import type { IDeleteImagesApplicationInput } from 'src/modules/masters/application/dtos/image/delete-images.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { IDeleteMasterProfileImagesPayload } from '../../validation/schemas/delete-master-profile-images-payload.types';
import { toMasterActor } from '../shared/to-master-actor';

export function payloadToDeleteMasterProfileImagesInput(
  masterProfileId: string,
  payload: IDeleteMasterProfileImagesPayload,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IDeleteImagesApplicationInput {
  return {
    entityType: ImageEntityType.MASTER_PROFILE_AVATAR,
    entityId: masterProfileId,
    fileIds: payload.fileIds,
    actor: toMasterActor(sessionUser, isStaffUser),
  };
}

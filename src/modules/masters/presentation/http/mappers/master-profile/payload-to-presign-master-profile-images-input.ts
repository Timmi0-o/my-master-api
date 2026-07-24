import { ImageEntityType } from 'src/modules/masters/domain/entities/image';
import type { IPresignImagesApplicationInput } from 'src/modules/masters/application/dtos/image/presign-images.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { IPresignMasterProfileImagesPayload } from '../../validation/schemas/presign-master-profile-images-payload.types';
import { toMasterActor } from '../shared/to-master-actor';

export function payloadToPresignMasterProfileImagesInput(
  masterProfileId: string,
  payload: IPresignMasterProfileImagesPayload,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IPresignImagesApplicationInput {
  return {
    entityType: ImageEntityType.MASTER_PROFILE_AVATAR,
    entityId: masterProfileId,
    files: payload.files,
    actor: toMasterActor(sessionUser, isStaffUser),
  };
}

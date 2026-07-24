import { ImageEntityType } from 'src/modules/masters/domain/entities/image';
import type { IPresignImagesApplicationInput } from 'src/modules/masters/application/dtos/image/presign-images.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { IPresignUserProfileImagesPayload } from '../../validation/schemas/presign-user-profile-images-payload.types';
import { toUserActor } from '../shared/to-user-actor';

export function payloadToPresignUserProfileImagesInput(
  userProfileId: string,
  payload: IPresignUserProfileImagesPayload,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IPresignImagesApplicationInput {
  return {
    entityType: ImageEntityType.CLIENT_PROFILE_AVATAR,
    entityId: userProfileId,
    files: payload.files,
    actor: toUserActor(sessionUser, isStaffUser),
  };
}

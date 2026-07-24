import { ImageEntityType } from 'src/modules/masters/domain/entities/image';
import type { IDeleteImagesApplicationInput } from 'src/modules/masters/application/dtos/image/delete-images.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { IDeleteUserProfileImagesPayload } from '../../validation/schemas/delete-user-profile-images-payload.types';
import { toUserActor } from '../shared/to-user-actor';

export function payloadToDeleteUserProfileImagesInput(
  userProfileId: string,
  payload: IDeleteUserProfileImagesPayload,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IDeleteImagesApplicationInput {
  return {
    entityType: ImageEntityType.CLIENT_PROFILE_AVATAR,
    entityId: userProfileId,
    fileIds: payload.fileIds,
    actor: toUserActor(sessionUser, isStaffUser),
  };
}

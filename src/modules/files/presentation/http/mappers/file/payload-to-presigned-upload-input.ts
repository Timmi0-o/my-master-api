import type { IPresignedUploadApplicationInput } from 'src/modules/files/application/dtos/file/presigned-upload.input';
import type { IGetMetadata } from 'src/modules/shared/domain/decorators/i-get-metadata';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { IPresignedUploadPayload } from '../../validation/schemas/presigned-upload-payload.schema';
import { toFileActor } from '../shared/to-file-actor';

export function payloadToPresignedUploadInput(
  payload: IPresignedUploadPayload,
  sessionUser: ISessionUser,
  metadata: IGetMetadata,
): IPresignedUploadApplicationInput {
  return {
    files: payload.files,
    userId: sessionUser.id,
    actor: toFileActor(sessionUser, metadata),
  };
}

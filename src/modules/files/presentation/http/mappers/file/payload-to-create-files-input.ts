import type { ICreateFilesApplicationInput } from 'src/modules/files/application/dtos/file/create-files.input';
import type { IGetMetadata } from 'src/modules/shared/domain/decorators/i-get-metadata';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { ICreateFilesPayload } from '../../validation/schemas/create-files-payload.schema';
import { toFileActor } from '../shared/to-file-actor';

export function payloadToCreateFilesInput(
  payload: ICreateFilesPayload,
  sessionUser: ISessionUser,
  metadata: IGetMetadata,
): ICreateFilesApplicationInput {
  return {
    files: payload.files.map((file) => ({
      ...file,
      fileSize: file.fileSize != null ? BigInt(file.fileSize) : undefined,
      uploadedBy: sessionUser.id,
    })),
    actor: toFileActor(sessionUser, metadata),
  };
}

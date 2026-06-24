import type { IDeleteFilesApplicationInput } from 'src/modules/files/application/dtos/file/delete-files.input';
import type { IGetMetadata } from 'src/modules/shared/domain/decorators/i-get-metadata';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { IDeleteFilesPayload } from '../../validation/schemas/delete-files-payload.types';
import { toFileActor } from '../shared/to-file-actor';

export function payloadToDeleteFilesInput(
  payload: IDeleteFilesPayload,
  sessionUser: ISessionUser,
  metadata: IGetMetadata,
): IDeleteFilesApplicationInput {
  return {
    fileIds: payload.fileIds,
    actor: toFileActor(sessionUser, metadata),
  };
}

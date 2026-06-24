import type { IMoveFileApplicationInput } from 'src/modules/files/application/dtos/file/move-file.input';
import type { IGetMetadata } from 'src/modules/shared/domain/decorators/i-get-metadata';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { IMoveFilePayload } from '../../validation/schemas/move-file-payload.types';
import { toFileActor } from '../shared/to-file-actor';

export function payloadToMoveFileInput(
  fileId: string,
  payload: IMoveFilePayload,
  sessionUser: ISessionUser,
  metadata: IGetMetadata,
): IMoveFileApplicationInput {
  return {
    fileId,
    folderId: payload.folderId ?? null,
    actor: toFileActor(sessionUser, metadata),
  };
}

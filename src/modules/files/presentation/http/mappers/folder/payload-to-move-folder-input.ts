import type { IMoveFolderApplicationInput } from 'src/modules/files/application/dtos/folder/move-folder.input';
import type { IGetMetadata } from 'src/modules/shared/domain/decorators/i-get-metadata';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { IMoveFolderPayload } from '../../validation/schemas/move-folder-payload.types';
import { toFileActor } from '../shared/to-file-actor';

export function payloadToMoveFolderInput(
  folderId: string,
  payload: IMoveFolderPayload,
  sessionUser: ISessionUser,
  metadata: IGetMetadata,
): IMoveFolderApplicationInput {
  return {
    folderId,
    parentId: payload.parentId,
    actor: toFileActor(sessionUser, metadata),
  };
}

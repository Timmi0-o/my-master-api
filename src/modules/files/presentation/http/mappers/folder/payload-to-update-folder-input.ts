import type { IUpdateFolderApplicationInput } from 'src/modules/files/application/dtos/folder/update-folder.input';
import type { IGetMetadata } from 'src/modules/shared/domain/decorators/i-get-metadata';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { IUpdateFolderPayload } from '../../validation/schemas/update-folder-payload.types';
import { toFileActor } from '../shared/to-file-actor';

export function payloadToUpdateFolderInput(
  folderId: string,
  payload: IUpdateFolderPayload,
  sessionUser: ISessionUser,
  metadata: IGetMetadata,
): IUpdateFolderApplicationInput {
  return {
    folderId,
    name: payload.name,
    allowedPurposes: payload.allowedPurposes,
    actor: toFileActor(sessionUser, metadata),
  };
}

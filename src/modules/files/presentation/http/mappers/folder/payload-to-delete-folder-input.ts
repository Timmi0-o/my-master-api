import type { IDeleteFolderApplicationInput } from 'src/modules/files/application/dtos/folder/delete-folder.input';
import type { IGetMetadata } from 'src/modules/shared/domain/decorators/i-get-metadata';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import { toFileActor } from '../shared/to-file-actor';

export function payloadToDeleteFolderInput(
  folderId: string,
  sessionUser: ISessionUser,
  metadata: IGetMetadata,
): IDeleteFolderApplicationInput {
  return {
    folderId,
    actor: toFileActor(sessionUser, metadata),
  };
}

import type { IGetFolderApplicationInput } from 'src/modules/files/application/dtos/folder/get-folder.input';
import type { IGetMetadata } from 'src/modules/shared/domain/decorators/i-get-metadata';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { IGetFolderQueryPayload } from '../../validation/schemas/get-folder-query.types';
import { toFileActor } from '../shared/to-file-actor';

export function payloadToGetFolderInput(
  payload: IGetFolderQueryPayload,
  sessionUser: ISessionUser,
  metadata: IGetMetadata,
): IGetFolderApplicationInput {
  return {
    ownerKind: payload.ownerKind,
    ownerId: payload.ownerId,
    path: payload.path ?? '/',
    actor: toFileActor(sessionUser, metadata),
  };
}

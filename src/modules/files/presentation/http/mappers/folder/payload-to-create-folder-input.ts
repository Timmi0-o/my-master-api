import type { ICreateFolderApplicationInput } from 'src/modules/files/application/dtos/folder/create-folder.input';
import type { IGetMetadata } from 'src/modules/shared/domain/decorators/i-get-metadata';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { ICreateFolderPayload } from '../../validation/schemas/create-folder-payload.types';
import { toFileActor } from '../shared/to-file-actor';

export function payloadToCreateFolderInput(
  payload: ICreateFolderPayload,
  sessionUser: ISessionUser,
  metadata: IGetMetadata,
): ICreateFolderApplicationInput {
  return {
    ownerKind: payload.ownerKind,
    ownerId: payload.ownerId,
    name: payload.name,
    parentId: payload.parentId ?? null,
    allowedPurposes: payload.allowedPurposes,
    actor: toFileActor(sessionUser, metadata),
  };
}

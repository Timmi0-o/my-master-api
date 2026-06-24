import type { IGetFilesByIdsApplicationInput } from 'src/modules/files/application/dtos/file/get-files-by-ids.input';
import type { IGetMetadata } from 'src/modules/shared/domain/decorators/i-get-metadata';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { IGetFilesByIdsPayload } from '../../validation/schemas/get-files-by-ids-payload.schema';
import { toFileActor } from '../shared/to-file-actor';

export function payloadToGetFilesByIdsInput(
  payload: IGetFilesByIdsPayload,
  sessionUser: ISessionUser,
  metadata: IGetMetadata,
): IGetFilesByIdsApplicationInput {
  return {
    fileIds: payload.fileIds,
    actor: toFileActor(sessionUser, metadata),
  };
}

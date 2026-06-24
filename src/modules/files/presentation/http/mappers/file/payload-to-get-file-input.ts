import type { IGetFileApplicationInput } from 'src/modules/files/application/dtos/file/get-file.input';
import type { IGetMetadata } from 'src/modules/shared/domain/decorators/i-get-metadata';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { IGetFileQueryPayload } from '../../validation/schemas/get-file-query.types';
import { toFileActor } from '../shared/to-file-actor';

export function payloadToGetFileInput(
  fileId: string,
  _query: IGetFileQueryPayload,
  sessionUser: ISessionUser,
  metadata: IGetMetadata,
): IGetFileApplicationInput {
  return {
    fileId,
    actor: toFileActor(sessionUser, metadata),
    params: {},
  };
}

import type { IRevokeFileAccessApplicationInput } from 'src/modules/files/application/dtos/file-access/revoke-file-access.input';
import type { IGetMetadata } from 'src/modules/shared/domain/decorators/i-get-metadata';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import { toFileActor } from '../shared/to-file-actor';

export function requestParamsToRevokeFileAccessUseCaseInput(
  fileId: string,
  accessId: string,
  sessionUser: ISessionUser,
  metadata: IGetMetadata,
): IRevokeFileAccessApplicationInput {
  return {
    fileId,
    accessId,
    actor: toFileActor(sessionUser, metadata),
  };
}

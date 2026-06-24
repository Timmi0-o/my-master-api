import type { IRevokeFileShareApplicationInput } from 'src/modules/files/application/dtos/file-share/revoke-file-share.input';
import type { IGetMetadata } from 'src/modules/shared/domain/decorators/i-get-metadata';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import { toFileActor } from '../shared/to-file-actor';

export function payloadToRevokeFileShareInput(
  shareId: string,
  sessionUser: ISessionUser,
  metadata: IGetMetadata,
): IRevokeFileShareApplicationInput {
  return {
    shareId,
    actor: toFileActor(sessionUser, metadata),
  };
}

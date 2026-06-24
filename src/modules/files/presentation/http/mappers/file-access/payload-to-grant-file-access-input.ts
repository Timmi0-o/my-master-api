import type { IGrantFileAccessApplicationInput } from 'src/modules/files/application/dtos/file-access/grant-file-access.input';
import type { IGetMetadata } from 'src/modules/shared/domain/decorators/i-get-metadata';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { IGrantFileAccessPayload } from '../../validation/schemas/grant-file-access-payload.types';
import { toFileActor } from '../shared/to-file-actor';

export function payloadToGrantFileAccessInput(
  fileId: string,
  payload: IGrantFileAccessPayload,
  sessionUser: ISessionUser,
  metadata: IGetMetadata,
): IGrantFileAccessApplicationInput {
  return {
    fileId,
    targetType: payload.targetType,
    targetId: payload.targetId,
    permissions: payload.permissions,
    reason: payload.reason ?? null,
    expiresAt: payload.expiresAt ? new Date(payload.expiresAt) : null,
    actor: toFileActor(sessionUser, metadata),
  };
}

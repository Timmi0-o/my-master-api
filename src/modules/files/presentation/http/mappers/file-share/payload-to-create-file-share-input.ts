import type { ICreateFileShareApplicationInput } from 'src/modules/files/application/dtos/file-share/create-file-share.input';
import type { IGetMetadata } from 'src/modules/shared/domain/decorators/i-get-metadata';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { ICreateFileSharePayload } from '../../validation/schemas/create-file-share-payload.types';
import { toFileActor } from '../shared/to-file-actor';

export function payloadToCreateFileShareInput(
  fileId: string,
  payload: ICreateFileSharePayload,
  sessionUser: ISessionUser,
  metadata: IGetMetadata,
): ICreateFileShareApplicationInput {
  return {
    fileId,
    password: payload.password ?? null,
    allowedIps: payload.allowedIps,
    maxDownloads: payload.maxDownloads ?? null,
    maxViews: payload.maxViews ?? null,
    allowDownload: payload.allowDownload,
    allowPreview: payload.allowPreview,
    expiresAt: payload.expiresAt ? new Date(payload.expiresAt) : null,
    name: payload.name ?? null,
    description: payload.description ?? null,
    actor: toFileActor(sessionUser, metadata),
  };
}

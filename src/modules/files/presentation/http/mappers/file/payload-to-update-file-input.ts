import { BadRequestException } from '@nestjs/common';
import type { IUpdateFileApplicationInput } from 'src/modules/files/application/dtos/file/update-file.input';
import type { IUpdateFileInput } from 'src/modules/files/domain/entities/file';
import type { IGetMetadata } from 'src/modules/shared/domain/decorators/i-get-metadata';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { IUpdateFilePayload } from '../../validation/schemas/update-file-payload.types';
import { pickPatch } from '../shared/pick-patch.util';
import { toFileActor } from '../shared/to-file-actor';

const PATCHABLE_KEYS = [
  'folderId',
  'fileName',
  'originalName',
  'mimeType',
  'fileSize',
  'checksum',
  'status',
  'fileType',
  'accessLevel',
  'purpose',
  'metadata',
  'tags',
] as const satisfies readonly (keyof IUpdateFileInput)[];

export function payloadToUpdateFileInput(
  fileId: string,
  payload: IUpdateFilePayload,
  sessionUser: ISessionUser,
  metadata: IGetMetadata,
): IUpdateFileApplicationInput {
  const patch = pickPatch(payload, PATCHABLE_KEYS) as IUpdateFileInput;

  if (payload.fileSize !== undefined) {
    patch.fileSize = BigInt(payload.fileSize);
  }

  if (Object.keys(patch).length === 0) {
    throw new BadRequestException(
      'Update payload must contain at least one mutable field',
    );
  }

  return {
    fileId,
    data: patch,
    actor: toFileActor(sessionUser, metadata),
  };
}

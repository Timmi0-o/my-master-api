import type { IQueryFilesApplicationInput } from 'src/modules/files/application/dtos/file/query-files.input';
import type { IFilePublicEntity } from 'src/modules/files/domain/entities/file';
import type { IGetMetadata } from 'src/modules/shared/domain/decorators/i-get-metadata';
import type { FindManyParams } from 'src/modules/shared/domain/query';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { IQueryFilesQueryPayload } from '../../validation/schemas/query-files-query.types';
import { toFileActor } from '../shared/to-file-actor';

export function payloadToQueryFilesInput(
  payload: IQueryFilesQueryPayload,
  sessionUser: ISessionUser,
  metadata: IGetMetadata,
): IQueryFilesApplicationInput {
  const where: FindManyParams<IFilePublicEntity, Record<never, never>>['where'] =
    {
      deletedAt: { isNull: true },
    };

  if (payload.ownerKind != null) {
    where.ownerKind = { eq: payload.ownerKind };
  }
  if (payload.ownerId != null) {
    where.ownerId = { eq: payload.ownerId };
  }
  if (payload.purpose != null) {
    where.purpose = { eq: payload.purpose };
  }

  return {
    actor: toFileActor(sessionUser, metadata),
    params: {
      where,
      slice: {
        limit: payload.take,
        offset: payload.skip,
      },
      orderBy: [{ field: 'createdAt', direction: 'desc' }],
    },
  };
}

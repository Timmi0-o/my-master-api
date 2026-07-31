import type { ReadResult } from 'src/modules/shared/domain/query';
import type { IUserPublicEntity } from 'src/modules/users/domain/entities/user';
import type { IProfileAvatarView } from '../image';
import type {
  IMasterServicePublicEntity,
  IMasterServiceRelations,
} from '../master-service';

export type IMasterProfileRelations = {
  services: ReadResult<IMasterServicePublicEntity, IMasterServiceRelations>[];
  avatar?: IProfileAvatarView | null;
  banner?: IProfileAvatarView | null;
  /** Owner user — for where filters (e.g. emailVerifiedAt), not a public include. */
  user?: IUserPublicEntity;
};

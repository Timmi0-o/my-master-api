import type { ReadResult } from 'src/modules/shared/domain/query';
import type { IProfileAvatarView } from '../image';
import type {
  IMasterServicePublicEntity,
  IMasterServiceRelations,
} from '../master-service';

export type IMasterProfileRelations = {
  services: ReadResult<IMasterServicePublicEntity, IMasterServiceRelations>[];
  avatar?: IProfileAvatarView | null;
};

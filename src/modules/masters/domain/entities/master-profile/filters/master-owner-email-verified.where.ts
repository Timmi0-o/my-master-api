import type {
  IMasterProfilePublicEntity,
  IMasterProfileRelations,
} from 'src/modules/masters/domain/entities/master-profile';
import type {
  IMasterServicePublicEntity,
  IMasterServiceRelations,
} from 'src/modules/masters/domain/entities/master-service';
import type { WhereFilter } from 'src/modules/shared/domain/query';

/** Nested where: master owner has confirmed email (discoverable / bookable). */
export const MASTER_OWNER_EMAIL_VERIFIED_WHERE: WhereFilter<
  IMasterProfilePublicEntity,
  IMasterProfileRelations
> = {
  user: {
    emailVerifiedAt: { isNull: false },
  },
};

export const MASTER_SERVICE_OWNER_EMAIL_VERIFIED_WHERE: WhereFilter<
  IMasterServicePublicEntity,
  IMasterServiceRelations
> = {
  masterProfile: {
    user: {
      emailVerifiedAt: { isNull: false },
    },
  },
};

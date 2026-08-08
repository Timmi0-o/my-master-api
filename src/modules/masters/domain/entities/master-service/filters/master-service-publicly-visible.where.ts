import type { WhereFilter } from 'src/modules/shared/domain/query';
import type { IMasterServicePublicEntity } from '../i-master-service.entity';
import type { IMasterServiceRelations } from '../i-master-service-relations';
import { EMasterServiceStatus } from '../master-service-status.enum';
import { MASTER_SERVICE_OWNER_EMAIL_VERIFIED_WHERE } from '../../master-profile/filters/master-owner-email-verified.where';

/** Public discoverability: not deleted, ACTIVE, owner email verified. */
export const MASTER_SERVICE_PUBLICLY_VISIBLE_WHERE: WhereFilter<
  IMasterServicePublicEntity,
  IMasterServiceRelations
> = {
  deletedAt: { isNull: true },
  status: { eq: EMasterServiceStatus.ACTIVE },
  ...MASTER_SERVICE_OWNER_EMAIL_VERIFIED_WHERE,
};

/** Status gate only (compose with other filters). */
export const MASTER_SERVICE_ACTIVE_STATUS_WHERE: WhereFilter<
  IMasterServicePublicEntity,
  IMasterServiceRelations
> = {
  status: { eq: EMasterServiceStatus.ACTIVE },
};

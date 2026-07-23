import type { MasterServiceRow } from '../master-service/master-service.row.types';
import type { MasterProfileRelationRow } from '../master-service/master-service.row.types';

export type FavoriteMasterServiceUserRow = {
  id: string;
  username: string;
  name: string;
  surname: string;
  patronymic: string | null;
};

export type FavoriteMasterServiceRow = {
  id: string;
  userId: string;
  masterServiceId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  user?: FavoriteMasterServiceUserRow | null;
  masterService?: (MasterServiceRow & {
    masterProfile?: MasterProfileRelationRow | null;
  }) | null;
};

import type { MasterProfileRow } from '../master-profile/master-profile.row.types';

export type MasterSubscriptionUserRow = {
  id: string;
  username: string;
  name: string;
  surname: string;
  patronymic: string | null;
};

export type MasterSubscriptionRow = {
  id: string;
  userId: string;
  masterProfileId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  user?: MasterSubscriptionUserRow | null;
  masterProfile?: MasterProfileRow | null;
};

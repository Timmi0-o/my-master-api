import type { IMasterProfilePublicEntity } from '../master-profile';

export type IMasterSubscriptionUserPublic = {
  id: string;
  username: string;
  name: string;
  surname: string;
  patronymic?: string | null;
};

export interface IMasterSubscriptionRelations {
  user?: IMasterSubscriptionUserPublic;
  masterProfile?: IMasterProfilePublicEntity;
}

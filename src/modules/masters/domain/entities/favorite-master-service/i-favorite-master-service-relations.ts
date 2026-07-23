import type { IMasterServicePublicEntity } from '../master-service';

export type IFavoriteMasterServiceUserPublic = {
  id: string;
  username: string;
  name: string;
  surname: string;
  patronymic?: string | null;
};

export interface IFavoriteMasterServiceRelations {
  user?: IFavoriteMasterServiceUserPublic;
  masterService?: IMasterServicePublicEntity;
}

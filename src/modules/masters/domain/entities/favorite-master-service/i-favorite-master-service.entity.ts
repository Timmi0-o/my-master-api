export interface IFavoriteMasterServiceEntity {
  id: string;
  userId: string;
  masterServiceId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export type IFavoriteMasterServicePublicEntity = IFavoriteMasterServiceEntity;

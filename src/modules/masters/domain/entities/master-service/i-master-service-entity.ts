export interface IMasterServiceEntity {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  masterProfileId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export type IMasterServicePublicEntity = IMasterServiceEntity;

export type ICreateMasterServiceInput = Omit<
  IMasterServiceEntity,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

export type IUpdateMasterServiceInput = Partial<
  Omit<ICreateMasterServiceInput, 'masterProfileId'>
>;

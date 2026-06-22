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

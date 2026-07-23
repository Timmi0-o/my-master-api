import type { EMasterServiceCategory } from './master-service-category.enum';

export interface IMasterServiceEntity {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  category: EMasterServiceCategory;
  tags: string[];
  masterProfileId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export type IMasterServicePublicEntity = IMasterServiceEntity;

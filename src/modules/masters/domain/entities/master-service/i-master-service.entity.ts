import type { EMasterServiceCategory } from './master-service-category.enum';
import type { EMasterServiceStatus } from './master-service-status.enum';

export interface IMasterServiceEntity {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  durationMinutes: number;
  category: EMasterServiceCategory;
  tags: string[];
  status: EMasterServiceStatus;
  masterProfileId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export type IMasterServicePublicEntity = IMasterServiceEntity;

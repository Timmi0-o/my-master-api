import type { EMasterServiceCategory } from 'src/modules/masters/domain/entities/master-service';

export interface ISearchCanonicalTagEntity {
  id: string;
  value: string;
  category: EMasterServiceCategory | null;
  createdAt: Date;
  updatedAt: Date;
}

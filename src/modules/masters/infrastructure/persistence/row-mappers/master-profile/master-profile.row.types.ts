import type { MasterServiceRelationRow } from '../master-service/master-service.row.types';

export type MasterProfileRow = {
  id: string;
  userId: string;
  displayName: string;
  description: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  services?: MasterServiceRelationRow[];
};

import type { EMasterServiceCategory } from 'src/modules/masters/domain/entities/master-service';

export interface IUpdateMasterServicePayload {
  name?: string;
  description?: string;
  price?: number;
  durationMinutes?: number;
  category?: EMasterServiceCategory;
  tags?: string[];
}

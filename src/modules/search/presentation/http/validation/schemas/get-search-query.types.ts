import type { EMasterServiceCategory } from 'src/modules/masters/domain/entities/master-service';

export interface IGetSearchQueryPayload {
  q?: string | null;
  category?: EMasterServiceCategory | null;
  limit?: number | null;
}

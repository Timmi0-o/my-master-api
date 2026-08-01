import type { EMasterServiceCategory } from 'src/modules/masters/domain/entities/master-service';
import type { TSearchSort } from 'src/modules/search/application/dtos/search-by-text.dto';

export interface IGetSearchQueryPayload {
  q?: string | null;
  category?: EMasterServiceCategory | null;
  localityId?: string | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  minRating?: number | null;
  sort?: TSearchSort | null;
  page?: number | null;
  limit?: number | null;
}

import type { EMasterServiceCategory } from 'src/modules/masters/domain/entities/master-service';
import type { IMasterProfilePublicEntity } from 'src/modules/masters/domain/entities/master-profile';
import type { IMasterServicePublicEntity } from 'src/modules/masters/domain/entities/master-service';
import type { PaginatedListMeta } from 'src/modules/shared/presentation/http/http-responses/build-paginated-list-response';

export const SEARCH_SORT_VALUES = [
  'relevance',
  'rating_desc',
  'price_asc',
  'price_desc',
] as const;

export type TSearchSort = (typeof SEARCH_SORT_VALUES)[number];

export interface ISearchByTextApplicationInput {
  q?: string;
  category?: EMasterServiceCategory;
  localityId?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sort?: TSearchSort;
  page?: number;
  limit?: number;
}

export type ISearchByTextApplicationOutput = {
  masters: IMasterProfilePublicEntity[];
  services: IMasterServicePublicEntity[];
  servicesMeta: PaginatedListMeta;
};

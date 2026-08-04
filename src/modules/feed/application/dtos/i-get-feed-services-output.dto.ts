import type {
  IMasterServicePublicEntity,
  IMasterServiceRelations,
} from 'src/modules/masters/domain/entities/master-service';
import type { PaginatedListMeta } from 'src/modules/shared/presentation/http/http-responses/build-paginated-list-response';

export type IGetFeedServicesApplicationOutput = {
  items: Array<IMasterServicePublicEntity & Partial<IMasterServiceRelations>>;
  total: number;
  meta: PaginatedListMeta;
};

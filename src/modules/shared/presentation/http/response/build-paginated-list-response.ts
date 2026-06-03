import { GET_MANY_DEFAULT_OFFSET, GET_MANY_DEFAULT_PAGE } from 'src/constants';

export type PaginatedListMeta = {
  total: number;
  totalCount: number;
  offset: number;
  limit: number;
  page: number;
};

export function buildPaginatedListResponse<T>(params: {
  items: readonly T[];
  totalCount: number;
  page?: number;
  limit?: number;
}): { data: T[]; meta: PaginatedListMeta } {
  const limit = params.limit ?? 20;
  const page = params.page ?? GET_MANY_DEFAULT_PAGE;
  const offset =
    page > GET_MANY_DEFAULT_PAGE
      ? (page - GET_MANY_DEFAULT_PAGE) * limit
      : GET_MANY_DEFAULT_OFFSET;

  return {
    data: [...params.items],
    meta: {
      total: params.items.length,
      totalCount: params.totalCount,
      offset,
      limit,
      page,
    },
  };
}

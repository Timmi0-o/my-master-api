import { DEFAULT_SLICE_LIMIT, type ISlice } from 'src/modules/shared/domain/query';

export function mapPaginationToSlice(params?: {
  page?: number;
  limit?: number;
}): ISlice {
  const limit = params?.limit ?? DEFAULT_SLICE_LIMIT;
  const page = params?.page ?? 1;

  return { offset: (page - 1) * limit, limit };
}

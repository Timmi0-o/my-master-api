/** Параметры выборки списка для persistence (без Prisma-типов). */
export interface IListQueryParams {
  where?: Record<string, unknown>;
  requiredIds?: string[];
  limit: number;
  offset: number;
  orderBy: Record<string, 'asc' | 'desc'>;
  select?: string[];
  include?: Record<string, unknown>;
}

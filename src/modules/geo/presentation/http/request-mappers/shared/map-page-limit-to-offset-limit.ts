export const GEO_DEFAULT_LIST_LIMIT = 20;

export function mapPageLimitToOffsetLimit(
  page?: number | null,
  limit?: number | null,
): { limit: number; offset: number } {
  const resolvedLimit = limit ?? GEO_DEFAULT_LIST_LIMIT;
  const resolvedPage = page ?? 1;

  return {
    limit: resolvedLimit,
    offset: (resolvedPage - 1) * resolvedLimit,
  };
}

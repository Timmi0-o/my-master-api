import type { WhereFilter } from 'src/modules/shared/domain/query';

export function mergeWhereFilters<T, R extends object = Record<never, never>>(
  base: WhereFilter<T, R> | undefined,
  extra: WhereFilter<T, R>,
): WhereFilter<T, R> {
  if (!base) {
    return extra;
  }
  return { and: [base, extra] } as WhereFilter<T, R>;
}

export function toDbWhere<T, R extends object = Record<never, never>>(
  where: WhereFilter<T, R> | undefined,
): Record<string, unknown> | undefined {
  if (!where || typeof where !== 'object') {
    return undefined;
  }

  return Object.keys(where).length > 0 ? (where as Record<string, unknown>) : undefined;
}

import type { WhereFilter } from 'src/modules/shared/domain/query';

export function toDbWhere<T, R extends object = Record<never, never>>(
  where: WhereFilter<T, R> | undefined,
): Record<string, unknown> | undefined {
  if (!where || typeof where !== 'object') {
    return undefined;
  }

  return Object.keys(where).length > 0 ? (where as Record<string, unknown>) : undefined;
}

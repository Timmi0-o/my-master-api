import type { WhereFilter } from 'src/modules/shared/domain/query';

export function mapSearchByFields<TEntity extends object>(
  searchText: string,
  fieldNames: (keyof TEntity & string)[],
  mode: 'STRICT' | 'PARTIAL' = 'PARTIAL',
): WhereFilter<TEntity> | undefined {
  if (!searchText?.trim() || fieldNames.length === 0) {
    return undefined;
  }

  if (mode === 'STRICT') {
    return {
      or: fieldNames.map((field) => ({
        [field]: searchText,
      })),
    } as WhereFilter<TEntity>;
  }

  return {
    or: fieldNames.map((field) => ({
      [field]: { containsInsensitive: searchText },
    })),
  } as WhereFilter<TEntity>;
}

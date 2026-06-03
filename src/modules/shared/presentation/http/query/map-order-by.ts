import type { OrderBy, OrderByItem, OrderDirection } from 'src/modules/shared/domain/query';

export function mapOrderBy<T, R extends object = Record<never, never>>(
  orderBy?: Record<string, OrderDirection>,
): OrderBy<T, R> | undefined {
  if (!orderBy) {
    return undefined;
  }

  const items: OrderByItem<T, R>[] = [];

  for (const [field, direction] of Object.entries(orderBy)) {
    if (direction === 'asc' || direction === 'desc') {
      items.push({ field: field as OrderByItem<T, R>['field'], direction });
    }
  }

  return items.length ? items : undefined;
}

import type { OrderBy, OrderDirection } from 'src/modules/shared/domain/query';

export function buildOrderBy<T, R extends object = Record<never, never>>(
  orderBy?: OrderBy<T, R>,
): Array<Record<string, OrderDirection | Record<string, OrderDirection>>> | undefined {
  if (!orderBy?.length) {
    return undefined;
  }

  return orderBy.map((item) => buildOrderByItem(item.field, item.direction));
}

function buildOrderByItem(
  field: string,
  direction: OrderDirection,
): Record<string, OrderDirection | Record<string, OrderDirection>> {
  const [relation, nestedField, ...rest] = field.split('.');

  if (nestedField === undefined || rest.length > 0) {
    return { [field]: direction };
  }

  return { [relation]: { [nestedField]: direction } };
}

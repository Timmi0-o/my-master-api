import type { ReadResultEntity } from './query-result.types';

export type WhereOperator<T> = {
  eq?: T;
  ne?: T;
  in?: T[];
  notIn?: T[];
  gt?: T;
  gte?: T;
  lt?: T;
  lte?: T;
  isNull?: boolean;
  contains?: T extends string ? string : never;
  containsInsensitive?: T extends string ? string : never;
};

type UnwrapRelationValue<V> =
  NonNullable<V> extends ReadonlyArray<infer U> ? NonNullable<U> : NonNullable<V>;

type RelationWhereFilter<R extends object> = {
  [K in keyof R]?: WhereFilter<ReadResultEntity<UnwrapRelationValue<R[K]>>>;
};

export type WhereFilter<T, R extends object = Record<never, never>> = {
  [K in keyof T]?: T[K] | WhereOperator<T[K]>;
} & RelationWhereFilter<R> & {
    and?: WhereFilter<T, R>[];
    or?: WhereFilter<T, R>[];
    not?: WhereFilter<T, R>;
  };

export function isWhereOperator<T>(value: unknown): value is WhereOperator<T> {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  const keys = [
    'eq',
    'ne',
    'in',
    'notIn',
    'gt',
    'gte',
    'lt',
    'lte',
    'isNull',
    'contains',
    'containsInsensitive',
  ] as const;

  return keys.some((k) => k in value);
}

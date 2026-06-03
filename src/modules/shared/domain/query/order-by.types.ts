import type { ReadResultEntity } from './query-result.types';

export type OrderDirection = 'asc' | 'desc';

type UnwrapRelationValue<V> =
  NonNullable<V> extends ReadonlyArray<infer U> ? NonNullable<U> : NonNullable<V>;

type RelationOrderByField<R extends object> = {
  [K in keyof R & string]: `${K}.${keyof ReadResultEntity<UnwrapRelationValue<R[K]>> & string}`;
}[keyof R & string];

export type OrderByField<T, R extends object = Record<never, never>> =
  | (keyof T & string)
  | RelationOrderByField<R>;

export type OrderByItem<T, R extends object = Record<never, never>> = {
  field: OrderByField<T, R>;
  direction: OrderDirection;
};

export type OrderBy<T, R extends object = Record<never, never>> = readonly OrderByItem<
  T,
  R
>[];

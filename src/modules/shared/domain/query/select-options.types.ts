import type { ReadResultEntity, ReadResultRelations } from './query-result.types';

export type QuerySelect<T> = readonly (keyof T & string)[] | undefined;

type UnwrapRelationValue<V> =
  NonNullable<V> extends ReadonlyArray<infer U> ? NonNullable<U> : NonNullable<V>;

export type NestedIncludeOptionFor<V> =
  | true
  | {
      select: readonly (keyof ReadResultEntity<UnwrapRelationValue<V>> & string)[];
      include?: never;
    }
  | {
      include: QueryInclude<
        ReadResultEntity<UnwrapRelationValue<V>>,
        ReadResultRelations<UnwrapRelationValue<V>>
      >;
      select?: never;
    };

export type NestedIncludeOption =
  | true
  | { select: readonly string[]; include?: never }
  | { include: Record<string, NestedIncludeOption>; select?: never };

export type QueryInclude<_T, R> = {
  [K in keyof R]?: NestedIncludeOptionFor<R[K]>;
};

export type SelectOptions<T, R extends object = Record<never, never>> = {
  select?: QuerySelect<T>;
  include?: QueryInclude<T, R>;
};

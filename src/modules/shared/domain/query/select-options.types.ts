import type { ReadResultEntity, ReadResultRelations } from './query-result.types';

export type QuerySelect<T> = readonly (keyof T & string)[] | undefined;

type UnwrapRelationValue<V> =
  NonNullable<V> extends ReadonlyArray<infer U> ? NonNullable<U> : NonNullable<V>;

export type SelectOptions<T, R extends object = Record<never, never>> = {
  select?: QuerySelect<T>;
  include?: { [K in keyof R]?: true };
};

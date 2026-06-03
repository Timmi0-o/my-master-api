declare const __readResultEntity: unique symbol;
declare const __readResultRelations: unique symbol;

export type ReadResult<TEntity, TRelations extends object = Record<never, never>> =
  TEntity &
    Partial<TRelations> & {
      readonly [__readResultEntity]?: TEntity;
      readonly [__readResultRelations]?: TRelations;
    };

export type ReadResultEntity<T> = T extends { readonly [__readResultEntity]?: infer E }
  ? unknown extends E
    ? T
    : E
  : T;

export type ReadResultRelations<T> = T extends {
  readonly [__readResultRelations]?: infer R;
}
  ? unknown extends R
    ? Record<never, never>
    : R extends object
      ? R
      : Record<never, never>
  : Record<never, never>;

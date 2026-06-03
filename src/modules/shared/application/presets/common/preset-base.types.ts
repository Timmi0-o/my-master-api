/**
 * Конфигурация пресета списка: какие поля запрашивать у persistence-слоя.
 */
export type NestedIncludeBase = {
  select?: string[];
};

export type NestedIncludeWithRelations<T> = NestedIncludeBase & {
  include?: T;
};

export type PresetConfig<TEntity, TInclude = undefined> = {
  select?: (keyof TEntity)[];
  include?: TInclude;
};

import type {
  EnrichOptions,
  SelectOptions,
} from 'src/modules/shared/domain/query';

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
  enrich?: EnrichOptions;
};

/**
 * Полный read-contract пресета: persistence select/include + application enrich.
 */
export type PresetReadOptions<
  T,
  R extends object = Record<never, never>,
> = SelectOptions<T, R> & {
  enrich?: EnrichOptions;
};

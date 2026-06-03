import type { OrderBy } from './order-by.types';
import type { SelectOptions } from './select-options.types';
import type { ISlice } from './slice.types';
import type { WhereFilter } from './where-filter.types';

export type FindOneParams<T, R extends object> = {
  selectOptions?: SelectOptions<T, R>;
};

export type FindManyParams<T, R extends object = Record<never, never>> = {
  where?: WhereFilter<T, R> | Record<string, unknown>;
  slice?: Partial<ISlice>;
  orderBy?: OrderBy<T, R>;
  selectOptions?: SelectOptions<T, R>;
  /** Monolith: приоритетные id в выдаче (бывший requiredIds). */
  requiredIds?: string[];
};

export type CountParams<T, R extends object = Record<never, never>> = {
  where?: WhereFilter<T, R> | Record<string, unknown>;
};

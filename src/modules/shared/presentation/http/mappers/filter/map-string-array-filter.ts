import type { WhereFilter } from 'src/modules/shared/domain/query';
import type { IStringArrayFilter } from 'src/modules/shared/application/presets/common/filter-preset.types';

export function mapStringArrayFilter<TEntity extends object>(
  field: keyof TEntity & string,
  filter: IStringArrayFilter,
): WhereFilter<TEntity> | undefined {
  if (!filter.value?.length) {
    return undefined;
  }

  if (filter.value.length === 1) {
    return { [field]: filter.value[0] } as WhereFilter<TEntity>;
  }

  if (filter.mode === 'AND') {
    return {
      and: filter.value.map((v) => ({ [field]: v })),
    } as WhereFilter<TEntity>;
  }

  return { [field]: { in: filter.value } } as WhereFilter<TEntity>;
}

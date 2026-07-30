import type { WhereFilter } from 'src/modules/shared/domain/query';
import type { INumberRangeArrayFilter } from 'src/modules/shared/application/presets/common/filter-preset.types';

export function mapMultiNumberRangeFilter<TEntity extends object>(
  field: keyof TEntity & string,
  filter: INumberRangeArrayFilter,
): WhereFilter<TEntity> | undefined {
  if (!filter.value?.length) {
    return undefined;
  }

  const parts = filter.value
    .map((range) => {
      const prismaRange: Record<string, number> = {};
      if (range.gte != null) prismaRange.gte = range.gte;
      if (range.gt != null) prismaRange.gt = range.gt;
      if (range.lte != null) prismaRange.lte = range.lte;
      if (range.lt != null) prismaRange.lt = range.lt;

      return Object.keys(prismaRange).length > 0
        ? ({ [field]: prismaRange } as WhereFilter<TEntity>)
        : undefined;
    })
    .filter((part): part is WhereFilter<TEntity> => part !== undefined);

  if (parts.length === 0) {
    return undefined;
  }

  if (parts.length === 1) {
    return parts[0];
  }

  return { or: parts } as WhereFilter<TEntity>;
}

import type { WhereFilter } from 'src/modules/shared/domain/query';
import type { IDateRangeArrayFilter } from 'src/modules/shared/application/presets/common/filter-preset.types';

function parseIsoDate(dateString: string): Date | undefined {
  const date = new Date(dateString);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function buildDateRange(
  range: NonNullable<IDateRangeArrayFilter['value']>[number],
): Record<string, Date> | undefined {
  const prismaRange: Record<string, Date> = {};

  if (range.gte) {
    const d = parseIsoDate(range.gte);
    if (d) prismaRange.gte = d;
  }
  if (range.gt) {
    const d = parseIsoDate(range.gt);
    if (d) prismaRange.gt = d;
  }
  if (range.lte) {
    const d = parseIsoDate(range.lte);
    if (d) prismaRange.lte = d;
  }
  if (range.lt) {
    const d = parseIsoDate(range.lt);
    if (d) prismaRange.lt = d;
  }

  return Object.keys(prismaRange).length > 0 ? prismaRange : undefined;
}

export function mapMultiDateRangeFilter<TEntity extends object>(
  field: keyof TEntity & string,
  filter: IDateRangeArrayFilter,
): WhereFilter<TEntity> | undefined {
  if (!filter.value?.length) {
    return undefined;
  }

  const parts = filter.value
    .map((range) => {
      const prismaRange = buildDateRange(range);
      return prismaRange ? ({ [field]: prismaRange } as WhereFilter<TEntity>) : undefined;
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

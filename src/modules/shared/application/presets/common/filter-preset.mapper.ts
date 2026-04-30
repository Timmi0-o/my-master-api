import type {
  IDateRangeArrayFilter,
  IStringArrayFilter,
} from './filter-preset.types';

/**
 * Маппинг валидированных «пресетов фильтров» в Prisma-совместимый where.
 * Без привязки к Prisma на уровне типов — только структура объекта.
 */
export class FilterPresetMapperCommon {
  static parseISODate(dateString: string): Date | undefined {
    try {
      const date = new Date(dateString);
      return Number.isNaN(date.getTime()) ? undefined : date;
    } catch {
      return undefined;
    }
  }

  static buildDateRangeFilter(
    from?: string,
    to?: string,
  ): Record<string, Date> {
    const filter: Record<string, Date> = {};

    if (from) {
      const fromDate = this.parseISODate(from);
      if (fromDate) filter.gte = fromDate;
    }

    if (to) {
      const toDate = this.parseISODate(to);
      if (toDate) filter.lte = toDate;
    }

    return filter;
  }

  static mapFieldByValues(
    fieldName: string,
    values: (string | number)[],
  ): Record<string, unknown> {
    const stringValues = values.filter(
      (v): v is string => typeof v === 'string',
    );

    if (stringValues.length === 0) return {};
    if (stringValues.length === 1) return { [fieldName]: stringValues[0] };

    return { [fieldName]: { in: stringValues } };
  }

  static mapStringArrayFilter(
    fieldName: string,
    filter: IStringArrayFilter,
  ): Record<string, unknown> {
    if (!filter.value?.length) return {};

    if (filter.value.length === 1) {
      return { [fieldName]: filter.value[0] };
    }

    if (filter.mode === 'AND') {
      return { AND: filter.value.map((v) => ({ [fieldName]: v })) };
    }

    return { [fieldName]: { in: filter.value } };
  }

  static mapSearchByFields(
    searchText: string,
    fieldNames: string[],
    mode: 'STRICT' | 'PARTIAL' = 'PARTIAL',
  ): Record<string, unknown> {
    if (!searchText?.trim() || fieldNames.length === 0) return {};

    if (mode === 'STRICT') {
      return {
        OR: fieldNames.map((field) => ({
          [field]: searchText,
        })),
      };
    }

    return {
      OR: fieldNames.map((field) => ({
        [field]: { contains: searchText, mode: 'insensitive' as const },
      })),
    };
  }

  static buildMultiDateRangeFilter(
    fieldName: string,
    filter: IDateRangeArrayFilter,
  ): Record<string, unknown> {
    if (!filter.value?.length) return {};

    const conditions = filter.value
      .map((range) => {
        const prismaRange: Record<string, Date> = {};
        if (range.gte) {
          const d = this.parseISODate(range.gte);
          if (d) prismaRange.gte = d;
        }
        if (range.gt) {
          const d = this.parseISODate(range.gt);
          if (d) prismaRange.gt = d;
        }
        if (range.lte) {
          const d = this.parseISODate(range.lte);
          if (d) prismaRange.lte = d;
        }
        if (range.lt) {
          const d = this.parseISODate(range.lt);
          if (d) prismaRange.lt = d;
        }
        return Object.keys(prismaRange).length > 0
          ? { [fieldName]: prismaRange }
          : null;
      })
      .filter(Boolean);

    if (conditions.length === 0) return {};
    if (conditions.length === 1)
      return conditions[0] as Record<string, unknown>;
    return { OR: conditions };
  }
}

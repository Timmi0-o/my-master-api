import type {
  IDateRangeArrayFilter,
  INumberRangeArrayFilter,
  IStatusFilterValue,
  IStringArrayFilter,
} from 'src/modules/shared/application/presets/common/filter-preset.types';
import type { WhereFilter } from 'src/modules/shared/domain/query';
import { mapMultiDateRangeFilter } from './map-multi-date-range-filter';
import { mapMultiNumberRangeFilter } from './map-multi-number-range-filter';
import { mapSearchByFields } from './map-search-by-fields';
import { mapStringArrayFilter } from './map-string-array-filter';

export type QueryFilterBuildConfigItem<TEntity extends object> =
  | {
      type: 'search';
      value?: string | null;
      fieldsBySearch: (keyof TEntity & string)[];
      mode?: 'STRICT' | 'PARTIAL' | null;
    }
  | {
      type: 'stringArray';
      field: keyof TEntity & string;
      value?: IStringArrayFilter | null;
    }
  | {
      type: 'dateRange';
      field: keyof TEntity & string;
      value?: IDateRangeArrayFilter | null;
    }
  | {
      type: 'numberRange';
      field: keyof TEntity & string;
      value?: INumberRangeArrayFilter | null;
    }
  | {
      type: 'nullStatus';
      field: keyof TEntity & string;
      value?: IStatusFilterValue | null;
    };

export function queryFilterBuildManager<
  TEntity extends object,
  TRelations extends object = Record<never, never>,
>(
  state: WhereFilter<TEntity, TRelations>[],
  config: QueryFilterBuildConfigItem<TEntity>[],
): void {
  for (const item of config) {
    switch (item.type) {
      case 'search': {
        if (!item.value) break;
        const part = mapSearchByFields<TEntity>(
          item.value,
          item.fieldsBySearch,
          item.mode ?? 'PARTIAL',
        );
        if (part) state.push(part);
        break;
      }
      case 'stringArray': {
        if (!item.value) break;
        const part = mapStringArrayFilter<TEntity>(item.field, item.value);
        if (part) state.push(part);
        break;
      }
      case 'dateRange': {
        if (!item.value) break;
        const part = mapMultiDateRangeFilter<TEntity>(item.field, item.value);
        if (part) state.push(part);
        break;
      }
      case 'numberRange': {
        if (!item.value) break;
        const part = mapMultiNumberRangeFilter<TEntity>(item.field, item.value);
        if (part) state.push(part);
        break;
      }
      case 'nullStatus': {
        if (!item.value) break;
        state.push({
          [item.field]: { isNull: !item.value.value },
        } as WhereFilter<TEntity, TRelations>);
        break;
      }
      default: {
        const _exhaustive: never = item;
        void _exhaustive;
      }
    }
  }
}

export function finalizeWhereFilterParts<
  TEntity extends object,
  TRelations extends object = Record<never, never>,
>(
  parts: WhereFilter<TEntity, TRelations>[],
): WhereFilter<TEntity, TRelations> | undefined {
  if (!parts.length) return undefined;
  if (parts.length === 1) return parts[0];
  return { and: parts } as WhereFilter<TEntity, TRelations>;
}

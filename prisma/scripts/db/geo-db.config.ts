import * as path from 'path';

export const GEO_DUMP_DIR = path.join(__dirname, '../../dumps');

/** Фиксированное имя дампа для restore. */
export const GEO_PROD_DUMP_FILENAME = 'geo.dump';

export const GEO_PROD_DUMP_PATH = path.join(GEO_DUMP_DIR, GEO_PROD_DUMP_FILENAME);

/**
 * Справочные geo-таблицы для data-only restore.
 * `addresses` не восстанавливаем из tourgis dump — другой AddressEntityType.
 */
export const GEO_DATA_TABLES = [
  'Countries',
  'Regions',
  'DistrictRegions',
  'Settlements',
  'Localities',
  'LocalityDistricts',
  'Streets',
  'LandPlots',
  'Buildings',
  'Apartments',
] as const;

export const DEFAULT_DOCKER_CONTAINER = 'my-master-api-postgres';

export function toPgQuotedTable(table: string): string {
  if (/^[a-z]/.test(table)) {
    return table;
  }

  return `"${table}"`;
}

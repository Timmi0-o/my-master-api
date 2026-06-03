import type { WhereFilter } from 'src/modules/shared/domain/query';
import { buildWhere } from './builders/where.builder';

function isPrismaLogicalWhere(where: Record<string, unknown>): boolean {
  return 'AND' in where || 'OR' in where || 'NOT' in where;
}

export function resolvePrismaWhere(
  where?: WhereFilter<unknown> | Record<string, unknown>,
): Record<string, unknown> | undefined {
  if (!where || typeof where !== 'object') {
    return undefined;
  }

  if (isPrismaLogicalWhere(where)) {
    return where;
  }

  if ('and' in where || 'or' in where || 'not' in where) {
    return buildWhere(where as WhereFilter<unknown>);
  }

  const built = buildWhere(where as WhereFilter<unknown>);
  return built ?? (Object.keys(where).length > 0 ? where : undefined);
}

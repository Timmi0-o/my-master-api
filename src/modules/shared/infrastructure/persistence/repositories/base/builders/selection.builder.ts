import type { QueryInclude, QuerySelect } from 'src/modules/shared/domain/query';
import type { RelationConfig } from '../config/relation.config';
import { buildInclude } from './include.builder';
import { buildSelect } from './select.builder';

/**
 * Prisma не разрешает top-level `select` и `include` одновременно:
 * при обоих relations вкладываются внутрь `select`.
 */
export function buildSelection<T, R>(
  select: QuerySelect<T> | undefined,
  include: QueryInclude<T, R> | undefined,
  relationConfig: Record<string, RelationConfig>,
):
  | { select: Record<string, unknown> }
  | { include: Record<string, unknown> }
  | Record<string, never> {
  const selectPart = buildSelect(select);
  const includePart = buildInclude(include, relationConfig);

  const hasSelect = 'select' in selectPart;
  const hasInclude = 'include' in includePart;

  if (hasSelect && hasInclude) {
    return {
      select: {
        ...selectPart.select,
        ...includePart.include,
      },
    };
  }

  if (hasSelect) {
    return selectPart;
  }

  if (hasInclude) {
    return includePart;
  }

  return {};
}

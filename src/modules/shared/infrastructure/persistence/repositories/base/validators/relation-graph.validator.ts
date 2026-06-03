import { InvalidQueryError } from 'src/modules/shared/domain/errors/invalid-query.error';
import type { RelationConfig } from '../config/relation.config';
import { assertSelectFields } from './select-fields.validator';

export function assertRelationGraph(
  include: unknown,
  graph: Record<string, RelationConfig>,
  path: string[] = [],
): void {
  if (!include || typeof include !== 'object') {
    return;
  }

  for (const [key, value] of Object.entries(
    include as Record<string, unknown>,
  )) {
    const cfg = graph[key];

    if (!cfg) {
      throw new InvalidQueryError(
        `Relation not allowed: ${[...path, key].join('.')}`,
        { path: [...path, key] },
      );
    }

    if (value === true || value == null) {
      continue;
    }

    if (typeof value === 'object') {
      if (
        'select' in value &&
        Array.isArray(value.select) &&
        cfg.allowedSelectFields
      ) {
        assertSelectFields(value.select, cfg.allowedSelectFields);
      }

      if ('include' in value && value.include && cfg.nested) {
        assertRelationGraph(value.include, cfg.nested, [...path, key]);
      }
    }
  }
}

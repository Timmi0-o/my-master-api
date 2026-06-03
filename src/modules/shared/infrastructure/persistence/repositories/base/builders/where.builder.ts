import {
  isWhereOperator,
  type WhereFilter,
  type WhereOperator,
} from 'src/modules/shared/domain/query';
import { escapeLikePattern } from '../escape/like-escape.util';

const LOGICAL_KEYS = new Set(['and', 'or', 'not']);

function buildOperator<T>(op: WhereOperator<T>): Record<string, unknown> {
  if (op.isNull === true) {
    return { equals: null };
  }

  if (op.isNull === false) {
    return { not: null };
  }

  const result: Record<string, unknown> = {};

  if (op.eq !== undefined) result.equals = op.eq;
  if (op.ne !== undefined) result.not = op.ne;
  if (op.in !== undefined) result.in = op.in;
  if (op.notIn !== undefined) result.notIn = op.notIn;
  if (op.gt !== undefined) result.gt = op.gt;
  if (op.gte !== undefined) result.gte = op.gte;
  if (op.lt !== undefined) result.lt = op.lt;
  if (op.lte !== undefined) result.lte = op.lte;

  if (op.contains !== undefined) {
    result.contains = escapeLikePattern(op.contains);
  }

  if (op.containsInsensitive !== undefined) {
    result.contains = escapeLikePattern(op.containsInsensitive);
    result.mode = 'insensitive';
  }

  return result;
}

function buildFieldCondition(value: unknown): unknown {
  if (isWhereOperator(value)) {
    return buildOperator(value);
  }

  if (isPlainObject(value)) {
    return buildWhere(value as WhereFilter<object>);
  }

  return value;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    !(value instanceof Date)
  );
}

export function buildWhere<T>(filter?: WhereFilter<T>): Record<string, unknown> | undefined {
  if (!filter) {
    return undefined;
  }

  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(filter)) {
    if (LOGICAL_KEYS.has(key) || value === undefined) {
      continue;
    }

    result[key] = buildFieldCondition(value);
  }

  if (filter.and?.length) {
    const clauses = filter.and
      .map((clause) => buildWhere(clause))
      .filter((clause): clause is Record<string, unknown> => clause !== undefined);

    if (clauses.length) {
      result.AND = clauses;
    }
  }

  if (filter.or?.length) {
    const clauses = filter.or
      .map((clause) => buildWhere(clause))
      .filter((clause): clause is Record<string, unknown> => clause !== undefined);

    if (clauses.length) {
      result.OR = clauses;
    }
  }

  if (filter.not) {
    const built = buildWhere(filter.not);

    if (built) {
      result.NOT = built;
    }
  }

  return Object.keys(result).length > 0 ? result : undefined;
}

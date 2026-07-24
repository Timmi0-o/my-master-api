import type {
  NestedIncludeOption,
  QueryInclude,
} from 'src/modules/shared/domain/query';
import type { RelationConfig } from '../config/relation.config';

function buildNestedIncludeOption(
  option: NestedIncludeOption,
  relationConfig: Record<string, RelationConfig>,
): Record<string, unknown> | true {
  if (option === true) {
    return true;
  }

  const result: Record<string, unknown> = {};

  if (option.select?.length) {
    result.select = Object.fromEntries(
      option.select.map((field) => [field, true]),
    );
  }

  if (option.include) {
    const nested = buildIncludeFromRecord(option.include, relationConfig);

    if (nested) {
      result.include = nested;
    }
  }

  return result;
}

function buildIncludeFromRecord(
  include: Record<string, NestedIncludeOption>,
  relationConfig: Record<string, RelationConfig>,
): Record<string, unknown> | undefined {
  const prismaInclude: Record<string, unknown> = {};

  for (const [key, option] of Object.entries(include)) {
    if (option === undefined) {
      continue;
    }

    const cfg = relationConfig[key];
    if (cfg?.virtual) {
      continue;
    }

    const prismaKey = cfg?.prismaName ?? key;
    const nestedConfig = cfg?.nested ?? {};

    prismaInclude[prismaKey] = buildNestedIncludeOption(option, nestedConfig);
  }

  return Object.keys(prismaInclude).length > 0 ? prismaInclude : undefined;
}

export function buildInclude<T, R>(
  include: QueryInclude<T, R> | undefined,
  relationConfig: Record<string, RelationConfig>,
): { include: Record<string, unknown> } | Record<string, never> {
  if (!include) {
    return {};
  }

  const built = buildIncludeFromRecord(
    include as Record<string, NestedIncludeOption>,
    relationConfig,
  );

  return built ? { include: built } : {};
}

import { InvalidQueryError } from 'src/modules/shared/domain/errors/invalid-query.error';

export function assertIncludeDepth(
  include: unknown,
  maxDepth: number,
  currentDepth = 1,
): void {
  if (!include || typeof include !== 'object') {
    return;
  }

  if (currentDepth > maxDepth) {
    throw new InvalidQueryError(
      `Include depth exceeded: max=${maxDepth}, got=${currentDepth}`,
      { maxDepth, currentDepth },
    );
  }

  for (const value of Object.values(include)) {
    if (value === true || value == null) {
      continue;
    }

    if (typeof value === 'object' && 'include' in value && value.include) {
      assertIncludeDepth(value.include, maxDepth, currentDepth + 1);
    }
  }
}

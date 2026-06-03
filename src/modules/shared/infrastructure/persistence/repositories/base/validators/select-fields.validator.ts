import { InvalidQueryError } from 'src/modules/shared/domain/errors/invalid-query.error';

export function assertSelectFields(
  select: readonly string[] | undefined,
  allowed: readonly string[],
): void {
  if (!select?.length) {
    return;
  }

  const allowedSet = new Set(allowed);
  const invalid = select.filter((field) => !allowedSet.has(field));

  if (invalid.length) {
    throw new InvalidQueryError(
      `Select fields not allowed: ${invalid.join(', ')}`,
      {
        invalid,
      },
    );
  }
}

import type { QuerySelect } from 'src/modules/shared/domain/query';

export function buildSelect<T>(
  select?: QuerySelect<T>,
): { select: Record<string, true> } | Record<string, never> {
  if (!select?.length) {
    return {};
  }

  const prismaSelect = Object.fromEntries(
    select.map((field) => [field, true]),
  ) as Record<string, true>;

  return { select: prismaSelect };
}

import { BadRequestException } from '@nestjs/common';

export function normalizeListQueryRaw<T extends Record<string, unknown>>(
  raw: unknown,
): T {
  const out: Record<string, unknown> = {
    ...(typeof raw === 'object' && raw !== null && !Array.isArray(raw)
      ? (raw as Record<string, unknown>)
      : {}),
  };

  if (typeof out.filter === 'string') {
    const filterValue = out.filter.trim();
    if (filterValue.length === 0) {
      delete out.filter;
    } else {
      try {
        out.filter = JSON.parse(filterValue) as unknown;
      } catch {
        throw new BadRequestException(
          'Query parameter filter must be a valid JSON object',
        );
      }
    }
  }

  if (out.requiredIds !== undefined && out.requiredIds !== null) {
    out.requiredIds = Array.isArray(out.requiredIds)
      ? out.requiredIds
      : [out.requiredIds];
  }

  return out as T;
}

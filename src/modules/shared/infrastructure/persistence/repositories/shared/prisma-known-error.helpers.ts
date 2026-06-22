export type PrismaKnownErrorLike = Error & {
  code: string;
  meta?: Record<string, unknown>;
};

export function isPrismaKnownError(
  error: unknown,
): error is PrismaKnownErrorLike {
  return (
    error instanceof Error &&
    'code' in error &&
    typeof (error as { code?: unknown }).code === 'string'
  );
}

export function normalizeUnknownPrismaError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}

export function readPrismaMetaTarget(meta?: Record<string, unknown>): string {
  if (!meta) {
    return '';
  }

  const target = meta['target'] ?? meta['field_name'] ?? meta['constraint'];

  if (Array.isArray(target)) {
    return target.map(String).join('_');
  }

  return typeof target === 'string' ? target : '';
}

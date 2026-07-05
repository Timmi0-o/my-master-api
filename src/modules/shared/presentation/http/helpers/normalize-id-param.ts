export function normalizeParams(
  params: unknown,
  keys: readonly string[],
): Record<string, string> {
  const raw =
    typeof params === 'object' && params !== null && !Array.isArray(params)
      ? (params as Record<string, unknown>)
      : {};

  const out: Record<string, string> = {};
  for (const key of keys) {
    out[key] = String(raw[key] ?? '');
  }

  return out;
}

export function normalizeIdParam(
  params: unknown,
  key = 'id',
): Record<string, string> {
  return normalizeParams(params, [key]);
}

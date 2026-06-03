export function pickPatch<T extends object, K extends keyof T>(
  source: T,
  keys: readonly K[],
): Pick<T, K> {
  const patch = {} as Pick<T, K>;

  for (const key of keys) {
    if (!Object.prototype.hasOwnProperty.call(source, key)) {
      continue;
    }

    const value = source[key];
    if (value === undefined) {
      continue;
    }

    patch[key] = value;
  }

  return patch;
}

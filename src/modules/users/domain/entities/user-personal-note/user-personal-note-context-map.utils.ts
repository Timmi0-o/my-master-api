import type {
  IUserPersonalNoteContextMap,
  TUserPersonalNoteContext,
} from './i-user-personal-note.entity';

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

function readOptionalString(
  value: unknown,
): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function parseUserPersonalNoteContextMap(
  value: unknown,
): IUserPersonalNoteContextMap {
  if (!isPlainObject(value)) {
    return {};
  }

  const master = readOptionalString(value.master);
  const client = readOptionalString(value.client);

  return {
    ...(master !== undefined ? { master } : {}),
    ...(client !== undefined ? { client } : {}),
  };
}

export function mergeUserPersonalNoteContextValue(
  current: IUserPersonalNoteContextMap,
  context: TUserPersonalNoteContext,
  value: string | null | undefined,
): IUserPersonalNoteContextMap {
  if (value === undefined) {
    return { ...current };
  }

  const next: IUserPersonalNoteContextMap = { ...current };
  const trimmed = typeof value === 'string' ? value.trim() : '';

  if (value === null || trimmed.length === 0) {
    delete next[context];
    return next;
  }

  next[context] = trimmed;
  return next;
}

export function isUserPersonalNoteContextMapEmpty(
  map: IUserPersonalNoteContextMap | null | undefined,
): boolean {
  if (!map) {
    return true;
  }

  return map.master == null && map.client == null;
}

export function normalizeNotesMap(
  map: IUserPersonalNoteContextMap,
): IUserPersonalNoteContextMap | null {
  return isUserPersonalNoteContextMapEmpty(map) ? null : map;
}

import type { IGetFolderQueryPayload } from '../validation/schemas/get-folder-query.types';

export function normalizeGetFolderQueryRaw(raw: unknown): IGetFolderQueryPayload {
  const obj =
    typeof raw === 'object' && raw !== null && !Array.isArray(raw)
      ? (raw as Record<string, unknown>)
      : {};

  return {
    ownerKind: String(obj.ownerKind ?? ''),
    ownerId: String(obj.ownerId ?? ''),
    path: obj.path != null ? String(obj.path) : '/',
  };
}

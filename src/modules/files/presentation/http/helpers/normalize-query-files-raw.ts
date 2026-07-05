import type { IQueryFilesQueryPayload } from '../validation/schemas/query-files-query.types';

export function normalizeQueryFilesRaw(raw: unknown): IQueryFilesQueryPayload {
  const obj =
    typeof raw === 'object' && raw !== null && !Array.isArray(raw)
      ? (raw as Record<string, unknown>)
      : {};

  const out: Record<string, unknown> = { ...obj };

  if (out.take != null) {
    out.take = Number(out.take);
  }
  if (out.skip != null) {
    out.skip = Number(out.skip);
  }

  return out as IQueryFilesQueryPayload;
}

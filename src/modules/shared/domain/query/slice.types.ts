export interface ISlice {
  offset: number;
  limit: number;
}

export const DEFAULT_SLICE_OFFSET = 0;
export const DEFAULT_SLICE_LIMIT = 20;
export const MAX_SLICE_LIMIT = 100;

export function resolveSlice(slice?: Partial<ISlice>): ISlice {
  const offset = Math.max(slice?.offset ?? DEFAULT_SLICE_OFFSET, 0);
  const limit = Math.min(
    Math.max(slice?.limit ?? DEFAULT_SLICE_LIMIT, 1),
    MAX_SLICE_LIMIT,
  );

  return { offset, limit };
}

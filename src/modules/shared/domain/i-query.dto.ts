export interface IBaseQuery {
  preset?: string;
}

export interface IBaseArrayQuery {
  preset?: string;
  limit?: number;
  page?: number;
  filter?: string;
  orderBy?: string;
  requiredIds?: string;
}

export type IRawArrayQuery = IBaseArrayQuery & Record<string, unknown>;
export type IRawQuery = IBaseQuery & Record<string, unknown>;

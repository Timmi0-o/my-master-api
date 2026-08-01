export interface IGetBuildingsQueryPayload {
  streetId: string;
  search?: string | null;
  limit?: number | null;
  page?: number | null;
}

export interface IGetStreetsQueryPayload {
  localityId: string;
  search?: string | null;
  limit?: number | null;
  page?: number | null;
}

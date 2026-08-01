export interface IGetApartmentsQueryPayload {
  buildingId: string;
  search?: string | null;
  limit?: number | null;
  page?: number | null;
}

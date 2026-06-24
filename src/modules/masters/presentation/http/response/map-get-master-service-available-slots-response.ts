import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/response/map-entity-http-response';
import type { IGetMasterServiceAvailableSlotsOutput } from 'src/modules/masters/application/dtos/master-service/get-master-service-available-slots.output';

export type IGetMasterServiceAvailableSlotsHttpResponse = ReturnType<
  typeof mapGetMasterServiceAvailableSlotsHttpResponse
>;

export function mapGetMasterServiceAvailableSlotsHttpResponse(
  output: IGetMasterServiceAvailableSlotsOutput,
) {
  return mapEntityHttpResponse(output);
}

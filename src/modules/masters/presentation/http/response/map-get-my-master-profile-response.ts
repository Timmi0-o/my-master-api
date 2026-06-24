import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/response/map-entity-http-response';
import type { IGetMyMasterProfileApplicationOutput } from 'src/modules/masters/application/dtos/master-profile/get-my-master-profile.output';

export type IGetMyMasterProfileHttpResponse = ReturnType<
  typeof mapGetMyMasterProfileHttpResponse
>;

export function mapGetMyMasterProfileHttpResponse(
  output: IGetMyMasterProfileApplicationOutput | null,
) {
  return mapEntityHttpResponse(output);
}

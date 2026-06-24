import type { IDeleteMasterServiceImagesApplicationOutput } from 'src/modules/masters/application/dtos/master-service/delete-master-service-images.output';
import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/response/map-entity-http-response';

export type IDeleteMasterServiceImagesHttpResponse = ReturnType<
  typeof mapDeleteMasterServiceImagesHttpResponse
>;

export function mapDeleteMasterServiceImagesHttpResponse(
  output: IDeleteMasterServiceImagesApplicationOutput,
) {
  return mapEntityHttpResponse(output);
}

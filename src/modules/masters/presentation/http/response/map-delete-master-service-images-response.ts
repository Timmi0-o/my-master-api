import type { IDeleteImagesApplicationOutput } from 'src/modules/masters/application/dtos/image/delete-images.output';
import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/response/map-entity-http-response';

export type IDeleteMasterServiceImagesHttpResponse = ReturnType<
  typeof mapDeleteMasterServiceImagesHttpResponse
>;

export function mapDeleteMasterServiceImagesHttpResponse(
  output: IDeleteImagesApplicationOutput,
) {
  return mapEntityHttpResponse(output);
}

import type { IDeleteImagesApplicationOutput } from 'src/modules/masters/application/dtos/image/delete-images.output';
import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/response/map-entity-http-response';

export type IDeleteMasterProfileImagesHttpResponse = ReturnType<
  typeof mapDeleteMasterProfileImagesHttpResponse
>;

export function mapDeleteMasterProfileImagesHttpResponse(
  output: IDeleteImagesApplicationOutput,
) {
  return mapEntityHttpResponse(output);
}

import type { IDeleteImagesApplicationOutput } from 'src/modules/masters/application/dtos/image/delete-images.output';
import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/response/map-entity-http-response';

export type IDeleteUserProfileImagesHttpResponse = ReturnType<
  typeof mapDeleteUserProfileImagesHttpResponse
>;

export function mapDeleteUserProfileImagesHttpResponse(
  output: IDeleteImagesApplicationOutput,
) {
  return mapEntityHttpResponse(output);
}

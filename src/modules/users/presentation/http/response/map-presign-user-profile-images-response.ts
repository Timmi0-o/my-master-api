import type { IPresignImagesApplicationOutput } from 'src/modules/masters/application/dtos/image/presign-images.output';
import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/response/map-entity-http-response';

export type IPresignUserProfileImagesHttpResponse = ReturnType<
  typeof mapPresignUserProfileImagesHttpResponse
>;

export function mapPresignUserProfileImagesHttpResponse(
  output: IPresignImagesApplicationOutput,
) {
  return mapEntityHttpResponse(output);
}

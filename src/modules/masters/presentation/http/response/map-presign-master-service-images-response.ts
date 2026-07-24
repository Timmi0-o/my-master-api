import type { IPresignImagesApplicationOutput } from 'src/modules/masters/application/dtos/image/presign-images.output';
import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/response/map-entity-http-response';

export type IPresignMasterServiceImagesHttpResponse = ReturnType<
  typeof mapPresignMasterServiceImagesHttpResponse
>;

export function mapPresignMasterServiceImagesHttpResponse(
  output: IPresignImagesApplicationOutput,
) {
  return mapEntityHttpResponse(output);
}

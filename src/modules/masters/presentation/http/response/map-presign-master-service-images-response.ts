import type { IPresignMasterServiceImagesApplicationOutput } from 'src/modules/masters/application/dtos/master-service/presign-master-service-images.output';
import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/response/map-entity-http-response';

export type IPresignMasterServiceImagesHttpResponse = ReturnType<
  typeof mapPresignMasterServiceImagesHttpResponse
>;

export function mapPresignMasterServiceImagesHttpResponse(
  output: IPresignMasterServiceImagesApplicationOutput,
) {
  return mapEntityHttpResponse(output);
}

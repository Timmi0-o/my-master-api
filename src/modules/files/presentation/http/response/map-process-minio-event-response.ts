import { mapEntityHttpResponse } from 'src/modules/shared/presentation/http/response/map-entity-http-response';

export type IProcessMinioEventHttpResponse = ReturnType<
  typeof mapProcessMinioEventHttpResponse
>;

export function mapProcessMinioEventHttpResponse(processed: boolean) {
  return mapEntityHttpResponse({ processed });
}

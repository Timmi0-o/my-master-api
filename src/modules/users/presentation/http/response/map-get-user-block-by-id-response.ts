import type { IGetUserBlockByIdApplicationOutput } from 'src/modules/users/application/dtos/user-block/get-user-block-by-id.output';
import { mapUserBlockHttpResponse } from './map-user-block-http-response';

export function mapGetUserBlockByIdHttpResponse(
  output: IGetUserBlockByIdApplicationOutput,
) {
  return mapUserBlockHttpResponse(output);
}

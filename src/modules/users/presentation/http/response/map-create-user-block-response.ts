import type { ICreateUserBlockApplicationOutput } from 'src/modules/users/application/dtos/user-block/create-user-block.output';
import { mapUserBlockHttpResponse } from './map-user-block-http-response';

export function mapCreateUserBlockHttpResponse(
  output: ICreateUserBlockApplicationOutput,
) {
  return mapUserBlockHttpResponse(output);
}

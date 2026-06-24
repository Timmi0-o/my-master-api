import type { IGetFileShareApplicationInput } from 'src/modules/files/application/dtos/file-share/get-file-share.input';
import type { IGetFileShareQueryPayload } from '../../validation/schemas/get-file-share-query.types';

export function payloadToGetFileShareInput(
  token: string,
  payload: IGetFileShareQueryPayload,
): IGetFileShareApplicationInput {
  return {
    token,
    password: payload.password,
    clientIp: payload.clientIp,
  };
}

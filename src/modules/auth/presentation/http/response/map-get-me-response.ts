import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';

export type IGetMeHttpResponse = ReturnType<typeof mapGetMeHttpResponse>;

export function mapGetMeHttpResponse(output: ISessionUser) {
  return output;
}

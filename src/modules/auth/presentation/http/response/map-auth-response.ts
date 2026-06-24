import type { IAuthResponse } from 'src/modules/auth/domain/auth.types';

export type IAuthHttpResponse = {
  data: IAuthResponse;
  success: boolean;
};

export type ILoginHttpResponse = ReturnType<typeof mapLoginHttpResponse>;
export type IRegisterHttpResponse = ReturnType<typeof mapRegisterHttpResponse>;
export type IRefreshHttpResponse = ReturnType<typeof mapRefreshHttpResponse>;

export function mapLoginHttpResponse(output: IAuthHttpResponse) {
  return output;
}

export function mapRegisterHttpResponse(output: IAuthHttpResponse) {
  return output;
}

export function mapRefreshHttpResponse(output: IAuthResponse) {
  return output;
}

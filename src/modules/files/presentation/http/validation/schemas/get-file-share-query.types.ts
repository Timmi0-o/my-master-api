export interface IGetFileShareHttpQueryPayload {
  password?: string;
}

export interface IGetFileShareQueryPayload extends IGetFileShareHttpQueryPayload {
  clientIp?: string;
}

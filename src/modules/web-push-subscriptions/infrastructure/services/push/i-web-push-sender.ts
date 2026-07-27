export interface IWebPushNotificationPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
}

export interface IWebPushSendTarget {
  endpoint: string;
  p256dh: string;
  auth: string;
  contentEncoding?: string;
}

export type IWebPushSendResult =
  | { ok: true }
  | { ok: false; statusCode: number | null; expired: boolean; message: string };

export interface IWebPushSender {
  isConfigured(): boolean;
  getPublicKey(): string | null;
  send(
    target: IWebPushSendTarget,
    payload: IWebPushNotificationPayload,
  ): Promise<IWebPushSendResult>;
}

export const WEB_PUSH_SENDER_TOKEN = Symbol('WEB_PUSH_SENDER_TOKEN');

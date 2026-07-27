import { Injectable } from '@nestjs/common';
import webpush from 'web-push';
import { loadVapidConfig } from '../../config/vapid.config';
import type {
  IWebPushNotificationPayload,
  IWebPushSendResult,
  IWebPushSendTarget,
  IWebPushSender,
} from './i-web-push-sender';

@Injectable()
export class WebPushSender implements IWebPushSender {
  private readonly config = loadVapidConfig();

  constructor() {
    if (this.config) {
      webpush.setVapidDetails(
        this.config.subject,
        this.config.publicKey,
        this.config.privateKey,
      );
    }
  }

  isConfigured(): boolean {
    return this.config != null;
  }

  getPublicKey(): string | null {
    return this.config?.publicKey ?? null;
  }

  async send(
    target: IWebPushSendTarget,
    payload: IWebPushNotificationPayload,
  ): Promise<IWebPushSendResult> {
    if (!this.config) {
      return {
        ok: false,
        statusCode: null,
        expired: false,
        message: 'VAPID is not configured',
      };
    }

    try {
      await webpush.sendNotification(
        {
          endpoint: target.endpoint,
          keys: {
            p256dh: target.p256dh,
            auth: target.auth,
          },
          ...(target.contentEncoding
            ? { contentEncoding: target.contentEncoding as 'aes128gcm' }
            : {}),
        },
        JSON.stringify({
          title: payload.title,
          body: payload.body,
          data: payload.data ?? {},
        }),
      );

      return { ok: true };
    } catch (error) {
      const statusCode = extractStatusCode(error);
      const expired = statusCode === 404 || statusCode === 410;

      return {
        ok: false,
        statusCode,
        expired,
        message: error instanceof Error ? error.message : 'Push send failed',
      };
    }
  }
}

function extractStatusCode(error: unknown): number | null {
  if (
    typeof error === 'object' &&
    error != null &&
    'statusCode' in error &&
    typeof (error as { statusCode: unknown }).statusCode === 'number'
  ) {
    return (error as { statusCode: number }).statusCode;
  }

  return null;
}

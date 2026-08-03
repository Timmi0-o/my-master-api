import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import {
  QUEUE_JOB_NAMES,
  QUEUE_NAMES,
} from '@shared/infrastructure/queues/queue.constants';
import { RedisService } from '@shared/infrastructure/redis/redis.service';
import type { Queue } from 'bullmq';
import { randomUUID } from 'crypto';
import type {
  TCallEndReason,
  TCallMedia,
} from '../../../presentation/web-socket/call/call-ws.events';

export type TCallSessionStatus = 'ringing' | 'active';

export interface ICallSession {
  callId: string;
  chatId: string;
  callerUserId: string;
  calleeUserId: string;
  media: TCallMedia;
  status: TCallSessionStatus;
}

const RING_TIMEOUT_MS = 45_000;
const CALL_SESSION_TTL_SECONDS = 2 * 60 * 60;

@Injectable()
export class CallSessionService {
  private onRingTimeout: ((session: ICallSession) => void) | null = null;

  constructor(
    private readonly redisService: RedisService,
    @InjectQueue(QUEUE_NAMES.CALL_RING_TIMEOUT)
    private readonly ringTimeoutQueue: Queue,
  ) {}

  setRingTimeoutHandler(handler: (session: ICallSession) => void): void {
    this.onRingTimeout = handler;
  }

  async findById(callId: string): Promise<ICallSession | null> {
    const value = await this.redisService
      .getClient()
      .get(this.getSessionKey(callId));
    return value ? (JSON.parse(value) as ICallSession) : null;
  }

  async findByUserId(userId: string): Promise<ICallSession | null> {
    const callId = await this.redisService
      .getClient()
      .get(this.getUserKey(userId));
    if (!callId) {
      return null;
    }

    const session = await this.findById(callId);
    if (!session) {
      await this.redisService.getClient().del(this.getUserKey(userId));
    }
    return session;
  }

  async isUserBusy(userId: string): Promise<boolean> {
    return (await this.findByUserId(userId)) !== null;
  }

  async createRinging(input: {
    chatId: string;
    callerUserId: string;
    calleeUserId: string;
    media: TCallMedia;
  }): Promise<ICallSession> {
    const callId = randomUUID();
    const session: ICallSession = {
      callId,
      chatId: input.chatId,
      callerUserId: input.callerUserId,
      calleeUserId: input.calleeUserId,
      media: input.media,
      status: 'ringing',
    };

    await this.saveSession(session);
    try {
      await this.ringTimeoutQueue.add(
        QUEUE_JOB_NAMES.CALL_RING_TIMEOUT,
        { callId },
        {
          jobId: callId,
          delay: RING_TIMEOUT_MS,
          removeOnComplete: true,
          removeOnFail: 50,
        },
      );
    } catch (error) {
      await this.removeSession(session);
      throw error;
    }

    return session;
  }

  async accept(callId: string, userId: string): Promise<ICallSession | null> {
    const session = await this.findById(callId);
    if (!session || session.status !== 'ringing') {
      return null;
    }
    if (session.calleeUserId !== userId) {
      return null;
    }

    session.status = 'active';
    await this.saveSession(session);
    await this.removeRingTimeout(callId);
    return session;
  }

  async removeIfParticipant(
    callId: string,
    userId: string,
  ): Promise<{ session: ICallSession; reason: TCallEndReason } | null> {
    const session = await this.findById(callId);
    if (!session) {
      return null;
    }
    if (session.callerUserId !== userId && session.calleeUserId !== userId) {
      return null;
    }

    const reason: TCallEndReason =
      session.status === 'ringing' && session.calleeUserId === userId
        ? 'reject'
        : 'hangup';

    await this.removeSession(session);
    return { session, reason };
  }

  async removeByDisconnect(userId: string): Promise<ICallSession | null> {
    const session = await this.findByUserId(userId);
    if (!session) {
      return null;
    }

    // Keep ringing while callee is offline so a push can wake them.
    if (session.status === 'ringing' && session.calleeUserId === userId) {
      return null;
    }

    await this.removeSession(session);
    return session;
  }

  async removeRinging(callId: string): Promise<ICallSession | null> {
    const session = await this.findById(callId);
    if (!session || session.status !== 'ringing') {
      return null;
    }

    await this.removeSession(session);
    return session;
  }

  invokeRingTimeoutHandler(session: ICallSession): void {
    this.onRingTimeout?.(session);
  }

  getPeerUserId(session: ICallSession, userId: string): string | null {
    if (session.callerUserId === userId) {
      return session.calleeUserId;
    }
    if (session.calleeUserId === userId) {
      return session.callerUserId;
    }
    return null;
  }

  assertParticipant(session: ICallSession, userId: string): boolean {
    return session.callerUserId === userId || session.calleeUserId === userId;
  }

  private async saveSession(session: ICallSession): Promise<void> {
    const serializedSession = JSON.stringify(session);
    await this.redisService
      .getClient()
      .multi()
      .set(
        this.getSessionKey(session.callId),
        serializedSession,
        'EX',
        CALL_SESSION_TTL_SECONDS,
      )
      .set(
        this.getUserKey(session.callerUserId),
        session.callId,
        'EX',
        CALL_SESSION_TTL_SECONDS,
      )
      .set(
        this.getUserKey(session.calleeUserId),
        session.callId,
        'EX',
        CALL_SESSION_TTL_SECONDS,
      )
      .exec();
  }

  private async removeSession(session: ICallSession): Promise<void> {
    await this.redisService
      .getClient()
      .del(
        this.getSessionKey(session.callId),
        this.getUserKey(session.callerUserId),
        this.getUserKey(session.calleeUserId),
      );
    await this.removeRingTimeout(session.callId);
  }

  private async removeRingTimeout(callId: string): Promise<void> {
    await this.ringTimeoutQueue.remove(callId).catch(() => undefined);
  }

  private getSessionKey(callId: string): string {
    return `call:session:${callId}`;
  }

  private getUserKey(userId: string): string {
    return `call:user:${userId}`;
  }
}

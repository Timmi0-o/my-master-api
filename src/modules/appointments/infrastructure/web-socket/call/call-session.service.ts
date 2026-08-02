import { Injectable } from '@nestjs/common';
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

@Injectable()
export class CallSessionService {
  private readonly sessionsById = new Map<string, ICallSession>();

  private readonly sessionIdByUserId = new Map<string, string>();

  private readonly ringTimeouts = new Map<string, NodeJS.Timeout>();
  private onRingTimeout: ((session: ICallSession) => void) | null = null;

  setRingTimeoutHandler(handler: (session: ICallSession) => void): void {
    this.onRingTimeout = handler;
  }

  findById(callId: string): ICallSession | null {
    return this.sessionsById.get(callId) ?? null;
  }

  findByUserId(userId: string): ICallSession | null {
    const callId = this.sessionIdByUserId.get(userId);
    if (!callId) {
      return null;
    }
    return this.sessionsById.get(callId) ?? null;
  }

  isUserBusy(userId: string): boolean {
    return this.sessionIdByUserId.has(userId);
  }

  createRinging(input: {
    chatId: string;
    callerUserId: string;
    calleeUserId: string;
    media: TCallMedia;
  }): ICallSession {
    const callId = randomUUID();
    const session: ICallSession = {
      callId,
      chatId: input.chatId,
      callerUserId: input.callerUserId,
      calleeUserId: input.calleeUserId,
      media: input.media,
      status: 'ringing',
    };

    this.sessionsById.set(callId, session);
    this.sessionIdByUserId.set(input.callerUserId, callId);
    this.sessionIdByUserId.set(input.calleeUserId, callId);

    const timeout = setTimeout(() => {
      const current = this.sessionsById.get(callId);
      if (!current || current.status !== 'ringing') {
        return;
      }
      this.removeSession(callId);
      this.onRingTimeout?.(current);
    }, RING_TIMEOUT_MS);

    this.ringTimeouts.set(callId, timeout);

    return session;
  }

  accept(callId: string, userId: string): ICallSession | null {
    const session = this.sessionsById.get(callId);
    if (!session || session.status !== 'ringing') {
      return null;
    }
    if (session.calleeUserId !== userId) {
      return null;
    }

    this.clearRingTimeout(callId);
    session.status = 'active';
    return session;
  }

  removeIfParticipant(
    callId: string,
    userId: string,
  ): { session: ICallSession; reason: TCallEndReason } | null {
    const session = this.sessionsById.get(callId);
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

    this.removeSession(callId);
    return { session, reason };
  }

  removeByDisconnect(userId: string): ICallSession | null {
    const session = this.findByUserId(userId);
    if (!session) {
      return null;
    }

    // Keep ringing while callee is offline so a push can wake them.
    if (session.status === 'ringing' && session.calleeUserId === userId) {
      return null;
    }

    this.removeSession(session.callId);
    return session;
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

  private clearRingTimeout(callId: string): void {
    const timeout = this.ringTimeouts.get(callId);
    if (timeout) {
      clearTimeout(timeout);
      this.ringTimeouts.delete(callId);
    }
  }

  private removeSession(callId: string): void {
    const session = this.sessionsById.get(callId);
    this.clearRingTimeout(callId);
    if (!session) {
      return;
    }
    this.sessionsById.delete(callId);
    this.sessionIdByUserId.delete(session.callerUserId);
    this.sessionIdByUserId.delete(session.calleeUserId);
  }
}

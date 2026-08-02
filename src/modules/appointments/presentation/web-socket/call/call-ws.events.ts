export const CALL_WS_EVENTS = {
  INVITE: 'call.invite',
  INCOMING: 'call.incoming',
  ACCEPT: 'call.accept',
  REJECT: 'call.reject',
  ACCEPTED: 'call.accepted',
  REJECTED: 'call.rejected',
  OFFER: 'call.offer',
  ANSWER: 'call.answer',
  ICE: 'call.ice',
  END: 'call.end',
  ENDED: 'call.ended',
  BUSY: 'call.busy',
} as const;

export const CALL_WS_USER_ROOM_NAME = (userId: string) => `user:${userId}`;

export type TCallMedia = 'audio' | 'video';

export type TCallEndReason =
  | 'hangup'
  | 'reject'
  | 'busy'
  | 'timeout'
  | 'disconnect'
  | 'error';

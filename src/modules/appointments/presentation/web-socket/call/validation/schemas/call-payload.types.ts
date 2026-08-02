export type TCallMedia = 'audio' | 'video';

export interface IInviteCallPayload {
  chatId: string;
  media: TCallMedia;
}

export interface ICallIdPayload {
  callId: string;
}

export interface ICallOfferPayload {
  callId: string;
  sdp: RTCSessionDescriptionInitLike;
}

export interface ICallAnswerPayload {
  callId: string;
  sdp: RTCSessionDescriptionInitLike;
}

export interface ICallIcePayload {
  callId: string;
  candidate: RTCIceCandidateInitLike | null;
}

export interface RTCSessionDescriptionInitLike {
  type: 'offer' | 'answer' | 'pranswer' | 'rollback';
  sdp?: string;
}

export interface RTCIceCandidateInitLike {
  candidate?: string | null;
  sdpMid?: string | null;
  sdpMLineIndex?: number | null;
  usernameFragment?: string | null;
}

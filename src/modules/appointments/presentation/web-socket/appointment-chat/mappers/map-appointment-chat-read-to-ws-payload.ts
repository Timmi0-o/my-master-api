import type { IAppointmentChatReadRealtimePayload } from 'src/modules/appointments/application/ports/i-appointment-chat-realtime.publisher';

export interface IAppointmentChatReadWsPayload {
  chatId: string;
  clientLastReadAt: string | null;
  masterLastReadAt: string | null;
}

export function mapAppointmentChatReadToWsPayload(
  payload: IAppointmentChatReadRealtimePayload,
): IAppointmentChatReadWsPayload {
  return {
    chatId: payload.chatId,
    clientLastReadAt: payload.clientLastReadAt?.toISOString() ?? null,
    masterLastReadAt: payload.masterLastReadAt?.toISOString() ?? null,
  };
}

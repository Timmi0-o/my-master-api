import type { IAppointmentChatMessageWithReplyTo } from '../../helpers/enrich-appointment-chat-message-reply-to.helper';

export type IGetAppointmentChatMessageWindowApplicationOutput = {
  items: IAppointmentChatMessageWithReplyTo[];
  hasMoreBefore: boolean;
  hasMoreAfter: boolean;
  limit: number;
};

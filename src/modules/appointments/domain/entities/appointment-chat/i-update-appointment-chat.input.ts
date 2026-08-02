import type { ICreateAppointmentChatInput } from './i-create-appointment-chat.input';

export type IUpdateAppointmentChatInput = Partial<ICreateAppointmentChatInput> & {
  clientLastReadAt?: Date | null;
  masterLastReadAt?: Date | null;
};

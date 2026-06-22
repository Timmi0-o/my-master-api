import type { ICreateAppointmentChatInput } from './i-create-appointment-chat.input';

export type IUpdateAppointmentChatInput = Partial<
  Omit<ICreateAppointmentChatInput, 'appointmentId'>
>;

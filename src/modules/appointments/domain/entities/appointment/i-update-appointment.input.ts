import type { ICreateAppointmentInput } from './i-create-appointment.input';

export type IUpdateAppointmentInput = Partial<
  Omit<ICreateAppointmentInput, 'masterProfileId' | 'masterServiceId' | 'clientUserId' | 'totalPrice' | 'serviceName' | 'durationMinutes'>
>;

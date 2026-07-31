import { IAppointmentPublicEntity } from '@modules/appointments/domain/entities/appointment';

export const APPOINTMENT_REALTIME_WS_EVENTS = {
  APPOINTMENT_CREATED: 'appointment.created',
  APPOINTMENT_UPDATED: 'appointment.updated',
} as const;

interface AppointmentRealtimeBaseEvent {
  appointment?: IAppointmentPublicEntity;
  recipientUserId?: string | null;
}

export interface AppointmentRealtimeCreatedEvent extends AppointmentRealtimeBaseEvent {
  type: 'appointment.created';
}

export interface AppointmentRealtimeUpdatedEvent extends AppointmentRealtimeBaseEvent {
  type: 'appointment.updated';
}

export type AppointmentRealtimeEvent =
  | AppointmentRealtimeCreatedEvent
  | AppointmentRealtimeUpdatedEvent;

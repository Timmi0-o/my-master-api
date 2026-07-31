import { IAppointmentPublicEntity } from '@modules/appointments/domain/entities/appointment';

export interface IAppointmentRealtimePublisher {
  appointmentCreated(
    appointment: IAppointmentPublicEntity,
    options?: { recipientUserId?: string | null },
  ): Promise<void>;
  appointmentUpdated(
    appointment: IAppointmentPublicEntity,
    options?: { recipientUserId?: string | null },
  ): Promise<void>;
}

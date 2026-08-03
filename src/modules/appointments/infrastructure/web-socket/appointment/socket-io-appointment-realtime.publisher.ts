import { IAppointmentRealtimePublisher } from '@modules/appointments/application/ports/appointment/i-appointment-realtime.publisher';
import { IAppointmentPublicEntity } from '@modules/appointments/domain/entities/appointment';
import { Injectable } from '@nestjs/common';
import { AppointmentRealtimeEventBus } from './appointment-realtime.event-bus';

@Injectable()
export class SocketIoAppointmentRealtimePublisher implements IAppointmentRealtimePublisher {
  constructor(private readonly eventBus: AppointmentRealtimeEventBus) {}

  async appointmentCreated(
    appointment: IAppointmentPublicEntity,
    options?: { recipientUserId?: string | null },
  ): Promise<void> {
    await this.eventBus.publish({
      type: 'appointment.created',
      appointment,
      recipientUserId: options?.recipientUserId ?? null,
    });
  }

  async appointmentUpdated(
    appointment: IAppointmentPublicEntity,
    options?: { recipientUserId?: string | null },
  ): Promise<void> {
    await this.eventBus.publish({
      type: 'appointment.updated',
      appointment,
      recipientUserId: options?.recipientUserId ?? null,
    });
  }
}

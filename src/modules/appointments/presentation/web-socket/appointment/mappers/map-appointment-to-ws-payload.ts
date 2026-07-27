import type { IAppointmentPublicEntity } from 'src/modules/appointments/domain/entities/appointment';

export interface IAppointmentWsPayload extends Omit<
  IAppointmentPublicEntity,
  'startsAt' | 'cancelledAt' | 'createdAt' | 'updatedAt' | 'deletedAt'
> {
  startsAt: string;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export function mapAppointmentToWsPayload(
  appointment: IAppointmentPublicEntity,
): IAppointmentWsPayload {
  return {
    id: appointment.id,
    masterProfileId: appointment.masterProfileId,
    masterServiceId: appointment.masterServiceId,
    clientUserId: appointment.clientUserId,
    startsAt: appointment.startsAt.toISOString(),
    durationMinutes: appointment.durationMinutes,
    status: appointment.status,
    totalPrice: appointment.totalPrice,
    serviceName: appointment.serviceName,
    cancelledAt: appointment.cancelledAt?.toISOString() ?? null,
    cancelledBy: appointment.cancelledBy ?? null,
    cancelReason: appointment.cancelReason ?? null,
    isEarlyCompletionByMaster: appointment.isEarlyCompletionByMaster,
    isEarlyCompletionByClient: appointment.isEarlyCompletionByClient,
    createdAt: appointment.createdAt.toISOString(),
    updatedAt: appointment.updatedAt.toISOString(),
    deletedAt: appointment.deletedAt?.toISOString() ?? null,
  };
}

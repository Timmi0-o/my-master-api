import type { IAppointmentEntity } from '../i-appointment.entity';
import { AppointmentNotFoundError } from '../errors';

export function ensureAppointmentExists(
  entity: IAppointmentEntity | null | undefined,
  id: string,
): asserts entity is IAppointmentEntity {
  if (!entity) {
    throw new AppointmentNotFoundError(id);
  }
}
